import { forwardRef, Module } from '@nestjs/common'
import { AppointmentModule } from '../appointment/appointment.module'
import { FlagStudio } from '../entities/flag.studio.entity'
import { ReviewModule } from '../review/review.module'
import { UserModule } from '../users/user.module'
import { StudioController } from './studio.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Studio } from './studio.entity'
import { StudioService } from './studio.service'
import { UserNotificationModule } from '../userNotification/userNotification.module'

@Module({
  imports: [
    ReviewModule,
    forwardRef(() => UserModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => UserNotificationModule),
    TypeOrmModule.forFeature([Studio, FlagStudio]),
  ],
  controllers: [StudioController],
  providers: [StudioService],
  exports: [TypeOrmModule, StudioService],
})
export class StudioModule {}
