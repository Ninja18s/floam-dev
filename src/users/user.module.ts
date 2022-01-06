import { forwardRef, Module } from '@nestjs/common'
import { CommunicationModule } from '../communication/communication.module'
import { AppointmentModule } from '../appointment/appointment.module'
import { StudioModule } from '../studio/studio.module'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UserService } from './user.service'
import { PaymentModule } from '../payment/payment.module'

@Module({
  imports: [
    forwardRef(() => AppointmentModule),
    forwardRef(() => StudioModule),
    forwardRef(() => CommunicationModule),
    forwardRef(() => PaymentModule),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
