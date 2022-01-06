import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { Payout } from './payout.entity';
import { PayoutController } from './payout.controller';
import { PayoutService } from './payout.service';
import { BankDetailModule } from '../bankDetail/bankDetail.module';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
     imports: [
          forwardRef(() => UserModule),
          forwardRef(() => BankDetailModule),
          forwardRef(() => AppointmentModule),
          TypeOrmModule.forFeature([Payout]),
     ],
     providers: [PayoutService],
     controllers: [PayoutController],
     exports: [PayoutService],
})
export class PayoutModule {}
