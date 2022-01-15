import {
     Body,
     Controller,
     Get,
     Logger,
     Param,
     Post,
     Delete,
     Query,
} from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutDto } from './payout.dto';
import { UserService } from '../users/user.service';
import { Payout } from './payout.entity';
import { AppointmentService } from '../appointment/appointment.service';
var cron = require('node-cron');
import moment = require('moment');
import { BankDetailService } from '../bankDetail/bankDetail.service';

@Controller('payouts')
export class PayoutController {
     cron: any;
     cron2: any;
     private log: Logger = new Logger('PayoutController');

     constructor(
          private readonly payoutService: PayoutService,
          private userService: UserService,
          private bankDetailService: BankDetailService,
          private appointmentService: AppointmentService
     ) {
          this.cron = cron.schedule('0 0 1 * *', async () => {
               var endDate = moment.utc().subtract(1, 'minutes');
               var month = moment.utc(endDate).month();
               var year = moment.utc(endDate).year();
               var startDate = moment.utc().set({
                    year: year,
                    month: month,
                    date: 16,
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
               });
               let payouts = await this.payoutService.getPayoutWithDates(
                    startDate,
                    endDate
               );
               if (payouts.length > 0) {
                    payouts.forEach(async (payout) => {
                         let user = await this.userService.getUser(
                              payout.userId
                         );
                         let bankDetail = await this.bankDetailService.getEntry(
                              payout.userId
                         );
                         let transfer = await this.payoutService.createTransferringToConnectAccount(
                              payout,
                              user
                         );
                         if (transfer && transfer.id) {
                              await this.payoutService.createPayoutToBankAccount(
                                   payout,
                                   bankDetail,
                                   user
                              );
                         }
                    });
                    return null;
               }
          });
          if (!this.cron.running) {
               this.cron.start();
          }
          this.cron2 = cron.schedule('0 0 16 * *', async () => {
               var endDate = moment.utc().subtract(1, 'minutes');
               var startDate = moment.utc().startOf('month').startOf('day');
               let payouts = await this.payoutService.getPayoutWithDates(
                    startDate,
                    endDate
               );
               if (payouts.length > 0) {
                    payouts.forEach(async (payout) => {
                         let user = await this.userService.getUser(
                              payout.userId
                         );
                         let bankDetail = await this.bankDetailService.getEntry(
                              payout.userId
                         );
                         let transfer = await this.payoutService.createTransferringToConnectAccount(
                              payout,
                              user
                         );
                         if (transfer && transfer.id) {
                              await this.payoutService.createPayoutToBankAccount(
                                   payout,
                                   bankDetail,
                                   user
                              );
                         }
                    });
                    return null;
               }
          });
          if (!this.cron2.running) {
               this.cron2.start();
          }
     }

     @Post()
     async createPayout(@Body() payoutDto: PayoutDto): Promise<Payout> {
          await this.userService.getUser(payoutDto.userId);
          let appointment = await this.appointmentService.getBooking(
               payoutDto.appointmentId
          );
          payoutDto.floamAmount = appointment.floamAmount;
          payoutDto.totalAmount = appointment.total;
          payoutDto.studioUserAmount =
               parseFloat(appointment.total) - payoutDto.floamAmount;
          const payout = await this.payoutService.createPayout(payoutDto);
          return payout;
     }

     @Post(':id/update')
     async updatePayout(@Param('id') id: string, @Body() status: string) {
          this.log.log(`processing update...`);
          let payout = await this.payoutService.update(id, status);
          return payout;
     }

     @Get('/all')
     async getAllPayouts(@Query('userId') userId: string) {
          this.log.log('[GET] user payouts.');
          if (userId) {
               let payouts = this.payoutService.getUserPayouts(userId);
               return payouts;
          } else {
               let payouts = this.payoutService.getAllPayouts();
               return payouts;
          }
     }
     @Post('/allPayouts')
     async getAllPayoutsByFilter(@Body() status: string) {

          let payouts = this.payoutService.getAllPayoutsByFilter(status);
          return payouts;

     }
}
