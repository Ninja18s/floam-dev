import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentController } from './payment.controller'
import { PaymentRepository } from './payment.repository'
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRepository])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
