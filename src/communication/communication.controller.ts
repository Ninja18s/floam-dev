import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UserService } from '../users/user.service'
import { PushTokenBody } from './comms.objects'
import { CommunicationService } from './communication.service'
import { NotificationPreference } from './notification.preference.entity'

@Controller('communication')
export class CommunicationController {
  constructor(
    private commsService: CommunicationService,
    private userService: UserService,
  ) {}

  @Post('/preferences')
  savePreferences(@Body() preference: NotificationPreference) {
    return this.commsService.saveNotificationPreference(preference)
  }

  @Get('/preferences/users/:userId')
  getPreferences(@Param('userId') userId: string) {
    return this.commsService.getNotificationPreferences(userId)
  }

  @Post('/push-token')
  async addPushToken(@Body() { userId, token }: PushTokenBody) {
    const user = await this.userService.getUser(userId)
    user.pushToken = token
    await this.userService.createOrUpdateUser(user)

    return 'push token saved.'
  }

  // @Post('send-push')
  // async testSendPush(@Body('userId') userId: string) {
  //   const user = await this.userService.getUser(userId)
  //   return this.commsService.sendPushNotification(user.pushToken, 'Sample message from floam api.')
  // }
}
