import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { PayoutDto } from './payout.dto';
import { Payout, PAYOUT_STATUSES } from './payout.entity';
const stripeTest = require('stripe')(
     'sk_test_51IpFtXBt3PovyCqB7tEHqxxsH6K3OgIqwm2A8TCfYCmk4RGR1GXIMzIKOf3PYdHXdlCgH99NjN1K7UqopENJSyPV00BAV1yJFD'
);
const stripeProd = require('stripe')('sk_test_MEvj1NP7uAlLRMMWukEMnzV5');

@Injectable()
export class PayoutService {
     private log: Logger = new Logger('PayoutService');

     constructor(
          @InjectRepository(Payout)
          private readonly PayoutServiceRepo: Repository<Payout>
     ) { }

     createPayout(dto: PayoutDto) {
          const {
               totalAmount,
               floamAmount,
               studioUserAmount,
               userId,
               appointmentId,
          } = dto;
          const payout: Payout = {
               totalAmount: parseFloat(totalAmount),
               floamAmount,
               studioUserAmount,
               userId,
               appointmentId,
               status: PAYOUT_STATUSES.REQUESTED,
               responseData: '',
               amountSend: false,
               stripeUserPayoutId: null,
          };
          return this.PayoutServiceRepo.save(payout);
     }

     async update(id: string, status) {
          let payout = await this.PayoutServiceRepo.findOne({
               where: { id: id },
          });
          if (payout.status == 'approved') {
               return 'payout already approved.';
          }
          if (payout.status == 'rejected') {
               return 'payout already rejected.';
          }
          payout.status = status;
          payout = await this.PayoutServiceRepo.save(payout);
          return payout;
     }

     async getUserPayouts(userId: string) {
          return await this.PayoutServiceRepo.find({
               where: { userId },
          });
     }

     async getAllPayouts() {
          return await this.PayoutServiceRepo.find();
     }
     async getAllPayoutsByFilter(status: string) {
          return await this.PayoutServiceRepo.find({
               where: { status }
          });
     }

     async getPayoutWithDates(startDate, endDate) {
          try {
               const payout: Payout[] = await this.PayoutServiceRepo.find({
                    where: {
                         createdAt: Between(startDate, endDate),
                         status: PAYOUT_STATUSES.APPROVED,
                    },
               });
               return payout;
          } catch (error) {
               console.log(error);
          }
     }

     async createTransferringToConnectAccount(payout, user): Promise<Payout> {
          try {
               const transfer = await stripeTest.transfers.create({
                    amount: parseInt(payout.studioUserAmount) * 100,
                    currency: 'usd',
                    destination: user.customerId,
                    transfer_group: 'Payout_' + payout.id,
               });
               if (transfer) {
                    return transfer;
               }
          } catch (err) {
               if (err.message) {
                    throw err.message;
               }
               throw err;
          }
     }

     async createPayoutToBankAccount(
          payout,
          bankDetail,
          user
     ): Promise<Payout> {
          try {
               const newPayout = await stripeTest.payouts.create(
                    {
                         amount: parseInt(payout.studioUserAmount) * 100,
                         currency: 'usd',
                         destination: bankDetail.bankAccountToken,
                    },
                    {
                         stripeAccount: user.customerId,
                    }
               );
               if (newPayout) {
                    if (newPayout) {
                         payout.stripeUserPayoutId = newPayout.id;
                         payout.amountSend = true;
                         payout.responseData = JSON.stringify(newPayout);
                         await this.PayoutServiceRepo.save(payout);
                    }
                    return null;
               }
          } catch (err) {
               if (err.message) {
                    throw err.message;
               }
               throw err;
          }
     }
}
