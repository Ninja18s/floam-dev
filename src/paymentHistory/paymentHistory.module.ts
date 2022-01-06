import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentHistory } from './paymentHistory.entity'
import { PaymentHistoryController } from './paymentHistory.controller'
import { PaymentHistoryService } from './paymentHistory.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([PaymentHistory])
  ],
  providers: [PaymentHistoryService],
  controllers: [PaymentHistoryController],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
