import { Controller, Logger, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Moment } from 'moment';
import { In, Not, Repository } from 'typeorm';
import { CreateAppointmentDto } from '../appointment/appointment.requests';
import { AppointmentService } from '../appointment/appointment.service';
import { Image, IMAGE_TYPE } from '../entities/image.entity';
import { CreateCardDto } from '../payment/payment.objects';
import { PaymentService } from '../payment/payment.service';
import { ReviewService } from '../review/review.service';
import { Studio } from '../studio/studio.entity';
import { StudioService } from '../studio/studio.service';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import {
     generateAddOns,
     generateReview,
     generateStudio,
     generateStudioRegistration,
     generateUser,
     studioPics,
} from '../utils/seeder';
import moment = require('moment');
import { database } from 'faker';

@Controller('seeder')
export class SeederController {
     private log: Logger = new Logger('SeederController');

     constructor(
          private userService: UserService,
          private studioService: StudioService,
          private reviewService: ReviewService,
          private apptService: AppointmentService,
          private paymentService: PaymentService,
          @InjectRepository(Image)
          private readonly imageRepo: Repository<Image>,
          @InjectRepository(User)
          private readonly userRepo: Repository<User>
     ) {}

     @Post('/default-users')
     async seedDefaultUsers() {
          const studio = await this.seedStudioManager();
          await this.seedArtist(studio);
          return true;
     }

     @Post('gen-user')
     genFakeUser() {
          return generateUser();
     }

     @Post('studio')
     genFakeStudio() {
          return this.generateStudioWithManager();
     }

     @Post('studio/registration')
     getFakeStudioReg() {
          return generateStudioRegistration();
     }

     @Post('seeddb')
     async postToSeedDB() {
          this.log.log(`**** seeding studios ***`);
          // seed studios
          for (let i = 0; i < 10; i++) {
               const manager = await this.userService.createOrUpdateUser(
                    generateUser()
               );
               let studio = generateStudio(manager);
               studio = await this.studioService.createOrUpdateStudio(studio);
               studio.addOns = generateAddOns(studio.id);
               const images: Image[] = studioPics.map((p) => {
                    return {
                         src: p,
                         type: IMAGE_TYPE.STUDIO,
                         studioId: studio.id,
                    };
               });
               await this.imageRepo.save(images);
               studio = await this.studioService.createOrUpdateStudio(studio);
               this.log.log(`Successfully created studio: ${studio.name}`);
          }

          this.log.log(`\n\n **** seeding artists ***`);
          // seed artists
          for (let i = 0; i < 10; i++) {
               const artist = await this.userService.createOrUpdateUser(
                    generateUser()
               );
               this.log.log(
                    `Successfully created artist: ${artist.firstName} ${artist.lastName}`
               );
          }

          this.log.log(`\n\n **** patching data ***`);
          await this.patchUserNames();
          return 'data seed successful';
     }

     @Post('/seeder/patch')
     async patchUserNames() {
          const studios = await this.studioService.getAllStudios();
          const usersWithStudio = studios.map((s) => s.user.id);
          const query = usersWithStudio.length
               ? { id: Not(In(usersWithStudio)) }
               : undefined;
          const artists = await this.userRepo.find({ where: query });
          const password = await bcrypt.hash('password', 10);

          const randomUser: User = {
               ...artists[0],
               email: 'artist@floam.co',
               password,
               firstName: 'Random',
               lastName: 'Floam User',
          };
          const mrFoxx: User = {
               ...artists[1],
               email: 'Mrfoxx@gmail.com',
               password,
               firstName: 'Jamie',
               lastName: 'Foxx',
          };
          const tBraxton: User = {
               ...artists[2],
               email: 'f-artist@gmail.com',
               password,
               firstName: 'Tamar',
               lastName: 'Braxton',
          };

          await this.userRepo.save([randomUser, mrFoxx, tBraxton]);
     }

     async generateStudioWithManager() {
          const manager = await this.userService.createOrUpdateUser(
               generateUser()
          );
          const studio = generateStudio(manager);
          return this.studioService.createOrUpdateStudio(studio);
     }

     async seedStudioManager() {
          let manager: User = {
               password: 'password',
               firstName: 'Jamie',
               lastName: 'Foxx',
               email: 'Mrfoxx@gmail.com',
               phone: '818-222-3333',
               dateOfBirth: '1967-12-13',
               docLink: '',
               gender: 'male',
               bio:
                    'Eric Marlon Bishop, known professionally as Jamie Foxx, is an American actor, singer, comedian, songwriter, and producer.',
               location: {
                    addressOne: '709 N La Brea Ave',
                    addressTwo: '',
                    state: 'CA',
                    city: 'Los Angeles',
                    zipCode: '90038',
               },
               isNewUser: false,
          };

          manager = await this.userService.createOrUpdateUser(manager);
          let studio = generateStudio(manager);
          studio = await this.studioService.createOrUpdateStudio(studio);

          // add images
          const image1: Image = {
               src:
                    'https://floam-dev.s3.us-east-2.amazonaws.com//studio-images/00F16CD8-6266-4D6A-9476-F58A932AB7EA.jpg',
               type: IMAGE_TYPE.STUDIO,
               studio,
          };
          const image2: Image = {
               src:
                    'https://floam-dev.s3.us-east-2.amazonaws.com//studio-images/0BE6749D-5ED8-4980-AA13-5DC9BD9F6C89.jpg',
               type: IMAGE_TYPE.STUDIO,
               studio,
          };
          await this.imageRepo.save([image1, image2]);

          // generate reviews for studio
          for (let i = 0; i < 4; i++) {
               const reviewUser = await this.userService.createOrUpdateUser(
                    generateUser()
               );
               const review = generateReview(studio, reviewUser);
               await this.reviewService.createReview(review);
          }

          return studio;
     }

     async seedArtist(studio: Studio) {
          let artist: User = {
               docLink: '',
               password: 'password',
               firstName: 'Tamar',
               lastName: 'Braxton',
               email: 'f-artist@gmail.com',
               phone: '818-111-2222',
               dateOfBirth: '1977-03-17',
               gender: 'female',
               bio:
                    'Tamar Estine Braxton is an American singer, actress, and television personality. Braxton began her career in 1990 as a founding member of The Braxtons, an R&B singing group formed with her sisters. The Braxtons released their debut album, So Many Ways, as a trio in 1996, and disbanded shortly afterward.',
               location: {
                    addressOne: '6060 Wilshire Blvd',
                    addressTwo: '',
                    state: 'CA',
                    city: 'Los Angeles',
                    zipCode: '90036',
               },
               isNewUser: false,
          };

          artist = await this.userService.registerUser(artist);

          // seed future appointments
          const futureDate = moment().add(1, 'week').hour(11).minute(0);
          await this.addAppointment(futureDate, artist, studio);

          // seed previous appointments
          const pastDate = moment().subtract(1, 'week').hour(11).minute(0);
          await this.addAppointment(pastDate, artist, studio);
     }

     async addAppointment(date: Moment, user: User, studio: Studio) {
          for (let i = 0; i < 3; i++) {
               const endDateTime = date.clone().add(3, 'h').toISOString();
               const apptDto: CreateAppointmentDto = {
                    studioId: studio.id,
                    userId: user.id,
                    startDateTime: date.toISOString(),
                    endDateTime,
                    total: `${Math.floor(Math.random() * 300)}.00`,
                    addOns: [],
                    notes: null,
                    numOfGuests: 0,
                    userCardId: null,
                    cardToken: null,
                    floamAmount: 0
               };
               await this.apptService.createBooking(apptDto, studio, user);
               date.add(1, 'd');
          }
     }

     @Post('save-card-workflow')
     async testSaveCardWorkflow() {
          const user = await generateUser();
          const registeredUser = await this.userService.registerUser(user);

          let temp = '';
          const card: CreateCardDto = {
               userId: registeredUser.id,
               isDefault: false,
               number: '4242424242424242',
               expMonth: '6',
               expYear: '2026',
               cvc: '314',
               location: registeredUser.location,
               name: `${registeredUser.firstName} ${registeredUser.lastName}`,
          };
          const payment = await this.paymentService.registerCard(card);
          temp = 'other breakpoint';
     }
}
