import { BaseDto } from '../base/base.dto';
import { LocationDto } from '../location/location.dto';

export interface UserDto extends BaseDto {
     password: string;
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     bio?: string;
     dateOfBirth: string;
     location: LocationDto;
     facebookId: string;
     googleId: string;
     appleId: string;
     loginType: string;
     isNewUser: boolean;
     ethnicity: string;
     gender: string;
     artistName: string;
     userId: string;
     customerId: string;
}
