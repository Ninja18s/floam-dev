import { BaseDto } from '../base/base.dto';

export interface UnserviceableLocationDto extends BaseDto {
     state: string;
     city: string;
     zipCode: string;
     lat?: number;
     lng?: number;
}
