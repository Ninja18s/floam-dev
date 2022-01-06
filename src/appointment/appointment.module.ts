import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CalendarModule } from '../calendar/calendar.module'
import { UserNotificationModule } from '../userNotification/userNotification.module'
import { CommunicationModule } from '../communication/communication.module'
import { Appointment } from './appointment.entity'
import { StudioModule } from '../studio/studio.module'
import { UserModule } from '../users/user.module'
import { AppointmentController } from './appointment.controller'
import { AppointmentService } from './appointment.service'
import { PaymentHistoryModule } from '../paymentHistory/paymentHistory.module'
import { PaymentModule } from '../payment/payment.module'
import { UserCardModule } from '../userCard/userCard.module'

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => StudioModule),
    forwardRef(() => CommunicationModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => UserNotificationModule),
    forwardRef(() => PaymentHistoryModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => UserCardModule),
    TypeOrmModule.forFeature([Appointment]),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
