import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentModule } from '../payment/payment.module'
import { AppointmentModule } from '../appointment/appointment.module'
import { Image } from '../entities/image.entity'
import { ReviewModule } from '../review/review.module'
import { Studio } from '../studio/studio.entity'
import { StudioModule } from '../studio/studio.module'
import { User } from '../users/user.entity'
import { UserModule } from '../users/user.module'
import { SeederController } from './seeder.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Image,
      Studio,
      User,
    ]),
    UserModule,
    StudioModule,
    ReviewModule,
    AppointmentModule,
    PaymentModule,
  ],
  controllers: [SeederController],
  exports: []
})
export class SeederModule {}
