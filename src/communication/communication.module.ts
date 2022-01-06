import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppGateway } from '../app/app.gateway'
import { UserModule } from '../users/user.module'
import { CommunicationController } from './communication.controller'
import { CommunicationService } from './communication.service'
import { NotificationPreference } from './notification.preference.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationPreference]),
    forwardRef(() => UserModule),
  ],
  controllers: [CommunicationController],
  providers: [CommunicationService, AppGateway],
  exports: [CommunicationService]
})
export class CommunicationModule {}
