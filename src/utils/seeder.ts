import * as faker from 'faker';
import { Appointment, APPT_STATUSES } from '../appointment/appointment.entity';
import { Location } from '../location/location.entity';
import { cities } from '../location/location.utils';
import { LEFT_BY_TYPES, Review } from '../review/review.entity';
import { Amenity } from '../studio/amenity.entity';
import {
     ARTIST_LEVELS,
     StudioRegistrationDto,
} from '../studio/dto/studio.registration.dto';
import {
     ADD_ON_PRICE_OPTION,
     StudioAddOn,
} from '../studio/studio.addon.entity';
import { Studio } from '../studio/studio.entity';
import { STUDIO_STATUS } from '../studio/studio.status';
import { User } from '../users/user.entity';
import moment = require('moment');

export const studioPicA =
     'https://images.unsplash.com/photo-1551710029-607e06bd45ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
export const studioPicB =
     'https://images.unsplash.com/photo-1563330232-57114bb0823c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80';
export const studioPicC =
     'https://images.unsplash.com/photo-1535406208535-1429839cfd13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80';
export const studioPics = [studioPicA, studioPicB, studioPicC];

export function generateReview(studio: Studio, user: User): Review {
     const appt = generateAppointment(user, studio);
     return {
          cleanlinessRating: Math.ceil(Math.random() * 5),
          timelinessRating: Math.ceil(Math.random() * 5),
          communicationRating: Math.ceil(Math.random() * 5),
          isExpectations: false,
          isRecommendations: false,
          rating: Math.ceil(Math.random() * 5),
          comment: faker.lorem.sentence(5),
          privateComment: null,
          studioId: studio.id,
          leftByUserId: user.id,
          leftByUserType: LEFT_BY_TYPES.ARTIST,
          appointment: appt,
          appointmentId: appt.id,
     };
}

export function generateAmenities(): Amenity[] {
     return [
          { isActive: true, description: 'Wifi', iconName: 'wifi' },
          { isActive: true, description: 'Bathroom', iconName: 'toilet' },
          { isActive: true, description: 'Lounge', iconName: 'couch' },
          { isActive: true, description: '420 Friendly', iconName: 'joint' },
          {
               isActive: true,
               description: 'refreshments',
               iconName: 'cookie-bite',
          },
          { isActive: true, description: 'Free Parking', iconName: 'parking' },
     ];
}

export function generateAddOns(
     studioId: string,
     count: number = 3
): StudioAddOn[] {
     const addOns: StudioAddOn[] = [];
     for (let i = 0; i < count; i++) {
          addOns.push({
               name: faker.name.title(),
               description: faker.lorem.sentence(3),
               price: 100,
               priceOption: ADD_ON_PRICE_OPTION.PER_HOUR,
               studioId,
          });
     }
     return addOns;
}

export function generateLocation(): Location {
     const index = Math.floor(Math.random() * (cities.length - 1));
     const { lat, lng } = cities[index];
     return {
          addressOne: faker.address.streetAddress(),
          addressTwo: null,
          state: faker.address.stateAbbr(),
          city: faker.address.city(),
          zipCode: faker.address.zipCode(),
          lat,
          lng,
     };
}

export function generateUser(): User {
     const dob = moment().subtract(25, 'years').format('YYYY-MM-DD');
     return {
          docLink: faker.internet.url(),
          password: faker.internet.password(8),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          bio: faker.lorem.words(20),
          location: generateLocation(),
          dateOfBirth: dob,
          gender: 'female',
          isNewUser: false,
     };
}

export function generateStudio(user?: User): Studio {
     return {
          name: faker.company.companyName(),
          status: STUDIO_STATUS.APPROVED,
          description: faker.lorem.sentence(20),
          rules: [
               faker.lorem.words(5),
               faker.lorem.words(5),
               faker.lorem.words(5),
          ],
          price: Math.floor(Math.random() * 200),
          capacity: 4,
          isLive: true,
          addOns: [],
          depositRequired: false,
          amenities: generateAmenities(),
          location: generateLocation(),
          genres: ['Hip Hop'],
          artistLevels: [ARTIST_LEVELS.BEGINNER],
          studioOpen: new Date(),
          studioClose: new Date(),
          user: user || generateUser(),
          hardware: [
               faker.lorem.words(5),
               faker.lorem.words(5),
               faker.lorem.words(5),
          ],
          software: [
               faker.lorem.words(5),
               faker.lorem.words(5),
               faker.lorem.words(5),
          ],
          studioLocation: 'Kitchen',
          minSessionLength: 2,
          userId: user.id,
     };
}

export function generateAppointment(user, studio): Appointment {
     const start = moment().subtract(1, 'day');
     return {
          start: start.toDate(),
          end: start.clone().add(3, 'hours').toDate(),
          total: '300',
          user: generateUser(),
          studio: generateStudio(),
          cancelledAt: null,
          cancellationReason: '',
          artistLeftReview: true,
          hostLeftReview: true,
          addOns: [],
          notes: null,
          numOfGuests: 0,
          status: APPT_STATUSES.CONFIRMED,
          userId: user.id,
          studioId: studio.id,
          notificationSent: false,
          isEarning: false,
          floamAmount: 0
     };
}

export function generateStudioRegistration(user?: User): StudioRegistrationDto {
     const manager = user || generateUser();
     return {
          depositRequired: false,
          minSessionLength: 2,
          photos: [
               { uri: studioPicA },
               { uri: studioPicB },
               { uri: studioPicC },
          ],
          studioId: null,
          hardware: [
               faker.lorem.words(5),
               faker.lorem.words(5),
               faker.lorem.words(5),
          ],
          software: [
               faker.lorem.words(5),
               faker.lorem.words(5),
               faker.lorem.words(5),
          ],
          name: faker.company.companyName(),
          description: faker.lorem.sentence(20),
          rules: [
               faker.lorem.words(5),
               faker.lorem.words(5),
               faker.lorem.words(5),
          ],
          price: Math.floor(Math.random() * 200),
          capacity: 40,
          userId: manager.id,
          amenities: generateAmenities(),
          location: generateLocation(),
          addOns: [],
          artistLevels: [ARTIST_LEVELS.BEGINNER],
          genres: ['Hip Hop'],
          studioClose: new Date(),
          studioOpen: new Date(),
          studioLocation: 'Kitchen',
     };
}
