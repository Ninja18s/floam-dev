import { Body, Controller, Get, Logger, Param, ParseBoolPipe, Post, Query } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudioDto } from '../studio/dto/studio.dto'
import { StudioService } from '../studio/studio.service'
import { UserService } from '../users/user.service'
import { Favorite } from './favorite.entity'

interface AddFavoriteReq {
  userId: string
  studioId: string
  isLiked: boolean
}

@Controller('favorites')
export class FavoritesController {
  private log: Logger = new Logger()

  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepo: Repository<Favorite>,
    private userService: UserService,
    private studioService: StudioService,
  ) {}

  @Get('/users/:userId')
  async getFavoritesForUser( @Param('userId') userId: string, @Query('justIds', ParseBoolPipe) justIds: boolean ): Promise<Favorite[] | StudioDto[]> {
    this.log.log('[GET] user favorite studios')
    const user = await this.userService.getUser(userId)
    const likedStudios = await this.favoritesRepo.find({
      where: { user }
    })

    if (justIds) {
      return likedStudios
    }

    const studioIds = likedStudios.map(i => i.studioId)
    return studioIds.length ? this.studioService.getStudiosByIds(studioIds) : []
  }

  @Post()
  async addFavorite(@Body() body: AddFavoriteReq) {
    this.log.log('[POST] add favorite')
    const user = await this.userService.getUser(body.userId)
    const studio = await this.studioService.getStudio(body.studioId)

    if (body.isLiked) {
      const favorite: Favorite = { user, studio }
      const alreadyExist = await this.favoritesRepo.find({ where: { userId: body.userId, studioId: body.studioId }});
      if (alreadyExist.length > 0){
        return 'favorite saved!'
      }
      else {
        await this.favoritesRepo.save(favorite)
        return 'favorite saved!'
      }
    }

    const savedFavorite = await this.favoritesRepo.findOne({
      where: { user, studio },
    })
    if (savedFavorite) {
      await this.favoritesRepo.delete(savedFavorite.id)
    }

    return 'favorite removed.'
  }
}
