import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateReview } from '../utils/seeder';
import { Studio } from '../studio/studio.entity';
import { User } from '../users/user.entity';
import { Review } from './review.entity';
import { GetReviewsCountResponse } from './review.api-objects';

@Injectable()
export class ReviewService {
     private log: Logger = new Logger('ReviewService');

     constructor(
          @InjectRepository(Review)
          private readonly reviewRepo: Repository<Review>,
          @InjectRepository(Studio)
          private readonly studioRepo: Repository<Studio>
     ) {}

     createReview(review: Review) {
          return this.reviewRepo.save(review);
     }

     getReviewsByStudio(studio: Studio): Promise<Review[]> {
          this.log.log('[getReviewsByStudio]');
          return this.reviewRepo.find({
               where: { studio },
               relations: ['leftByUser', 'studio'],
          });
     }

     async getReviewsByUser(user: User): Promise<Review[]> {
          const studios: Studio[] = await this.studioRepo.find({
               where: { user },
          });

          const allReviewsForUser: Review[] = [];
          for (const studio of studios) {
               const reviews: Review[] = await this.getReviewsByStudio(studio);
               allReviewsForUser.push(...reviews);
          }
          return allReviewsForUser;
     }

     async getReviewsCount(): Promise<GetReviewsCountResponse> {
          try {
               const totalCount = await this.reviewRepo.count({});
               const recommendedCount = await this.reviewRepo.count({
                    where: {
                         isRecommendations: true,
                    },
               });
               return {
                    totalCount,
                    recommendedCount,
                    notRecommendedCount: totalCount - recommendedCount,
               };
          } catch (error) {
               throw error;
          }
     }

     async calculateAverageRating(reviews: Review[]): Promise<number> {
          if (!reviews.length) {
               return 5;
          }

          const reviewIds = reviews.map((r) => r.id);
          const { avgRating } = await this.reviewRepo
               .createQueryBuilder('review')
               .select('avg(review.rating)', 'avgRating')
               .whereInIds(reviewIds)
               .getRawOne();
          return parseFloat(avgRating.toFixed(1));
     }

     async seedReviews(user: User, studio: Studio) {
          for (let i = 0; i < 10; i++) {
               const review: Review = generateReview(studio, user);
               await this.reviewRepo.save(review);
          }
     }

     async addRating(review: Review) {
          let rating =
               review.cleanlinessRating +
               review.timelinessRating +
               review.communicationRating;
          let avgRating = rating / 3;
          return avgRating;
     }
}
