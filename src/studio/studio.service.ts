import { LatLngLiteral } from '@googlemaps/google-maps-services-js/dist'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { resolve } from 'path'
import { In, Repository, Not, Between, FindConditions, Any } from 'typeorm'
import { MoreThanOrEqual } from 'typeorm/index'
import { FlagStudio } from '../entities/flag.studio.entity'
import { isWithinRange, zipToLatLng } from '../location/location.utils'
import { ReviewService } from '../review/review.service'
import { User } from '../users/user.entity'
import { UserService } from '../users/user.service'
import { StudioDto } from './dto/studio.dto'
import { StudioFilter } from './dto/studio.filter'
import { Studio } from './studio.entity'
import { StudioNotFoundException } from './StudioNotFoundException'
var nodemailer = require('nodemailer');

@Injectable()
export class StudioService {
  private log: Logger = new Logger('StudioService')

  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
    @InjectRepository(FlagStudio)
    private readonly flaggedStudioRepo: Repository<FlagStudio>,
    private userService: UserService,
    private reviewService: ReviewService,
  ) { }

  createOrUpdateStudio(studio: Studio) {
    return this.studioRepository.save(studio)
  }

  async getStudiosByIds(studioIds: string[]) {
    const studios = await this.studioRepository.find({
      where: { id: In(studioIds) }
    })
    return this.transformToDtos(studios)

  }

  async getAllStudios() {
    const studios = await this.studioRepository.find()
    return this.transformToDtos(studios)
  }

  async getStudiosWithFilter(filter: StudioFilter): Promise<StudioDto[]> {
    let idsToExclude: string[] = []
    const { userId, minPrice, maxPrice, zipCode, maxDistance, guests, latitude, longitude, offSet, limit } = filter
    let { statuses } = filter
    if (typeof statuses === 'string') {
      statuses = JSON.parse(statuses)
    }
    let query: FindConditions<Studio> = { status: In(statuses) }

    if (minPrice && maxPrice) {
      query = { ...query, price: Between(minPrice, maxPrice) }
    }

    if (maxPrice && maxPrice >= 200) {
      query = { ...query, price: MoreThanOrEqual(minPrice) };
    }

    if (guests) {
      query = { ...query, capacity: MoreThanOrEqual(guests) }
    }

    if (userId) {
      const user = await this.userService.getUser(userId)
      const flaggedStudios = await this.flaggedStudioRepo.find({
        where: { user }
      })

      if (flaggedStudios) {
        idsToExclude = flaggedStudios.map(s => s.studioId)
      }
    }

    console.time("yoyo");
    query = idsToExclude.length ? { ...query, id: Not(In(idsToExclude)) } : query
    let result = await this.studioRepository.find({
      take: limit || 5,
      skip: offSet || 0,
      where: query
    })
    console.timeEnd("yoyo");

    if (!result) {
      result = []
    }

    if (latitude && longitude) {
      const range = maxDistance || 100
      const origin = { lat: latitude, lng: longitude }
      result = result.filter(studio => {
        // filter by location
        const { location: { lat, lng } } = studio
        const destination: LatLngLiteral = { lat, lng }
        return isWithinRange(origin, destination, range)
      })
    }

    return this.transformToDtos(result)
  }

  async getStudio(studioId: string): Promise<Studio> {
    const studio = await this.studioRepository.findOne(studioId)
    if (!studio) {
      throw new StudioNotFoundException()
    }
    return studio
  }

  async getStudioDto(studioId: string): Promise<StudioDto> {
    const studio = await this.getStudio(studioId)
    return this.transformToDto(studio)
  }

  getStudiosByUser(user: User): Promise<Studio[]> {
    return this.studioRepository.find({
      where: { user }
    })
  }

  async transformToDtos(studios: Studio[]): Promise<StudioDto[]> {
    const response = []
    await Promise.all(studios.map(studio=>{
      return new Promise((resolve)=>{
        this.transformToDto(studio).then(studioDto=>{
          response.push(studioDto);
          resolve(true);
        })
      }) 
    }))
    // for (const studio of studios) {
    //   const studioDto = await this.transformToDto(studio)
    //   response.push(studioDto)
    // }
    return response
  }

  async transformToDto(studio: Studio): Promise<StudioDto> {
    const reviews = await this.reviewService.getReviewsByStudio(studio)
    let rating: number = 5
    if (reviews && reviews.length > 0) {
      rating = await this.reviewService.calculateAverageRating(reviews)
    }

    return {
      ...studio,
      rating,
      reviewsCount: reviews.length || 0,
    }
  }

  async flagStudio(userId: string, studioId: string, text: string): Promise<string> {
    const user = await this.userService.getUser(userId)
    const studio = await this.studioRepository.findOne(studioId)

    const flagStudio: FlagStudio = {
      userId,
      user,
      studioId,
      studio,
    }
    await this.flaggedStudioRepo.save(flagStudio)
    sendEmail('floamco1@gmail.com', user, studio, text);
    return 'studio has been successfully flagged.'
  }

  async hasActiveStudio(user: User) {
    const studios = await this.studioRepository.find({ where: { userId: user.id, status: 'APPROVED' } });
    return studios.length > 0
  }
}

let sendEmail = async (email, user, studio, text) => {
  let msg = `${user.firstName} ${user.lastName} (${user.email}) has reported the studio ${studio.name} for the following reason :<br></br>
  description: ${text}`;;
  let data = {
    to: email,
    subject: 'floam App',
    html: msg,
    from: '',
  };

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'support@floam.co',
      pass: 'fmoowdfaheljnmsy'
    },
  });

  try {
    let info = await transporter.sendMail(data);
    console.log(info);
  } catch (err) {
    console.log(err);
  }
};
