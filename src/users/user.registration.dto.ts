import { LocationDto } from '../location/location.dto';

export interface UserRegistrationDto {
     firstName: string;
     lastName: string;
     phone: string;
     email: string;
     password: string; // todo: @ade how to send over the wire?
     dateOfBirth: string;
     docLink: string;
     bio: string;
     gender: string;
     ethnicity?: string;
     location: LocationDto;
     artistName?: string;
     facebookId: string;
     googleId: string;
     appleId: string;
     loginType: string;
     isNewUser: boolean;
     customerId: string;
}
