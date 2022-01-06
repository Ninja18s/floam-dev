import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Appointment } from '../appointment/appointment.entity';
import { AppointmentService } from '../appointment/appointment.service';
import { StudioService } from '../studio/studio.service';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import {
     GetReviewsCountResponse,
     GetReviewsForStudioByUserResponse,
     SaveReviewDto,
     SeedReviewsBody,
} from './review.api-objects';
import { LEFT_BY_TYPES, Review } from './review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
     private log: Logger = new Logger('StudioController');

     constructor(
          private reviewService: ReviewService,
          private studioService: StudioService,
          private userService: UserService,
          private apptService: AppointmentService
     ) {}

     @Get('/studios/:studioId')
     async getAllReviews(
          @Param('studioId') studioId: string
     ): Promise<Review[]> {
          this.log.log('[POST] getAllReviews for studio');
          const studio = await this.studioService.getStudio(studioId);

          const reviews = await this.reviewService.getReviewsByStudio(studio);
          this.log.debug(reviews);
          return reviews;
     }

     @Get('/users/:userId')
     async getReviewsForStudioByUser(
          @Param('userId') userId: string
     ): Promise<GetReviewsForStudioByUserResponse> {
          this.log.log('[Get] getReviewsForStudioByUser');
          const user: User = await this.userService.getUser(userId);

          const reviews = await this.reviewService.getReviewsByUser(user);
          const rating = await this.reviewService.calculateAverageRating(
               reviews
          );

          const response = { rating, reviews };

          this.log.debug('***** all user reviews *****');
          this.log.debug(response);
          this.log.debug('***** all user reviews *****\n');
          return response;
     }

     @Get('/count')
     async getReviewsCount(): Promise<GetReviewsCountResponse> {
          this.log.log('[Get] getReviewsCount');
          const reviewCount = await this.reviewService.getReviewsCount();
          const response = reviewCount;
          this.log.debug('***** all user reviews *****');
          this.log.debug(response);
          this.log.debug('***** all user reviews *****\n');
          return response;
     }

     @Post()
     async submitReview(@Body() reviewDto: SaveReviewDto): Promise<Review> {
          this.log.log('[POST] submit review');
          const appt: Appointment = await this.apptService.getBooking(
               reviewDto.appointmentId
          );

          const reviewToSave: Review = { ...reviewDto, appointment: appt };
          if (reviewDto.leftByUserType === LEFT_BY_TYPES.ARTIST) {
               appt.artistLeftReview = true;
          }

          if (reviewDto.leftByUserType === LEFT_BY_TYPES.STUDIO_MANAGER) {
               appt.hostLeftReview = true;
          }

          await this.apptService.createOrUpdate(appt);
          const avgRaring = await this.reviewService.addRating(reviewDto);
          reviewToSave.rating = avgRaring;
          return this.reviewService.createReview(reviewToSave);
     }

     @Post('/seed')
     async seedDB(@Body() body: SeedReviewsBody) {
          const user: User = await this.userService.getUser(body.userId);
          const studio = await this.studioService.getStudio(body.studioId);
          await this.reviewService.seedReviews(user, studio);
          return 'reviews added!';
     }
}
