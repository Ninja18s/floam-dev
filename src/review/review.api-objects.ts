import { LEFT_BY_TYPES, Review } from './review.entity';

export interface SaveReviewDto {
     rating: number;
     comment: string;
     privateComment: string | null;
     studioId: string;
     leftByUserId: string;
     leftByUserType: LEFT_BY_TYPES;
     appointmentId: string;
     cleanlinessRating: number;
     timelinessRating: number;
     communicationRating: number;
     isExpectations: boolean;
     isRecommendations: boolean;
}

export interface SeedReviewsBody {
     userId: string;
     studioId: string;
}

export interface GetReviewsForStudioByUserResponse {
     rating: number;
     reviews: Review[];
}

export interface GetReviewsCountResponse {
     totalCount: number;
     recommendedCount: number;
     notRecommendedCount: number;
}
