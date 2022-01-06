import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommunicationModule } from '../communication/communication.module'
import { UserModule } from '../users/user.module'
import { UserNotification } from './userNotification.entity'
import { UserNotificationController } from './userNotification.controller'
import { UserNotificationService } from './userNotification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification])
  ],
  providers: [UserNotificationService],
  controllers: [UserNotificationController],
  exports: [UserNotificationService],
})
export class UserNotificationModule {}
