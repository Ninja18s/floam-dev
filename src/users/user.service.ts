import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { PaymentService } from '../payment/payment.service';
import { CommunicationService } from '../communication/communication.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import UserNotFoundException from './UserNotFoundException';
const stripeTest = require('stripe')(
     'sk_test_51IpFtXBt3PovyCqB7tEHqxxsH6K3OgIqwm2A8TCfYCmk4RGR1GXIMzIKOf3PYdHXdlCgH99NjN1K7UqopENJSyPV00BAV1yJFD'
);
const stripeProd = require('stripe')('sk_test_MEvj1NP7uAlLRMMWukEMnzV5');

@Injectable()
export class UserService {
     private log: Logger = new Logger('UserService');

     constructor(
          @InjectRepository(User)
          private readonly userRepository: Repository<User>,
          private commsService: CommunicationService,
          private paymentService: PaymentService
     ) {}

     createOrUpdateUser(userData: User): Promise<User> {
          return this.userRepository.save(userData, { reload: true });
     }

     async getUser(userId: string): Promise<User> {
          const user = await this.userRepository.findOne(userId);
          if (!user) {
               throw new UserNotFoundException();
          }

          return user;
     }

     getAll() {
          return this.userRepository.find();
     }

     async getByLoginInfo(email: string, password: string): Promise<User> {
          const user = await this.userRepository.findOne({
               where: { email },
          });

          if (!user) {
               throw new UserNotFoundException();
          }

          const isSamePassword = await bcrypt.compare(password, user.password);
          if (!isSamePassword) {
               throw new UserNotFoundException();
          }
          return user;
     }

     async registerUser(user: User): Promise<User> {
          const createdUser = await this.createOrUpdateUser(user);
          await this.commsService.createDefaultNotificationPreferences(
               createdUser
          );
          await this.paymentService.create(user);
          return createdUser;
     }

     async registerSocialUser(user: User): Promise<User> {
          const createdUser = await this.createOrUpdateUser(user);
          await this.commsService.createDefaultNotificationPreferences(
               createdUser
          );
          // await this.paymentService.create(user)
          return createdUser;
     }

     // async tempPaymentDataPatch() {
     //   const users = await this.userRepository.find()
     //   for (const user of users) {
     //     await this.paymentService.create(user)
     //   }
     // }

     async getUserFromEmail(email: string): Promise<User> {
          const user = await this.userRepository.findOne({
               where: { email },
          });
          if (!user) {
               throw new UserNotFoundException();
          }
          return user;
     }

     async createCustomAccountForUser(data): Promise<{ id: string }> {
          try {
               const account = await stripeTest.accounts.create({
                    country: 'US',
                    type: 'custom',
                    email: data.email,
                    business_type: 'individual',
                    capabilities: {
                         card_payments: { requested: true },
                         transfers: { requested: true },
                    },
               });
               return account;
          } catch (err) {
               if (err.message) {
                    throw err.message;
               }
               throw err;
          }
     }
}
