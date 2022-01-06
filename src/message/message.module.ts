import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommunicationModule } from '../communication/communication.module'
import { UserModule } from '../users/user.module'
import { Message } from './message.entity'
import { MessageController } from './message.controller'
import { MessageService } from './message.service';
import { UserNotificationModule } from '../userNotification/userNotification.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => UserModule),
    forwardRef(() => UserNotificationModule),
    CommunicationModule,
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [],
})
export class MessageModule {}
