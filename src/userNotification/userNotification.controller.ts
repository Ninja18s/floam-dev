import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { UserNotificationService } from './userNotification.service'

@Controller('userNotifications')
export class UserNotificationController {
  private log: Logger = new Logger('UserNotificationController')

  constructor(
    private readonly userNotificationService: UserNotificationService,
  ) {}

  @Get('users/:userId')
  async getUserNotifications(@Param('userId') userId: string){
    this.log.log('[GET] notification which belong to user')
    const userNotifications = await this.userNotificationService.getNotificationsByUser(userId)
    this.userNotificationService.findReadNotification(userNotifications);
    return (userNotifications)
  }

  @Post('/:notificationId/mark')
  async markMessageAsRead(@Param('notificationId') notificationId: string) {
    return this.userNotificationService.markAsRead(notificationId)
  }

  @Get('getDot/:userId')
  async getDot(@Param('userId') userId: string){
    this.log.log('[GET] notification which belong to user')
    const userNotification = await this.userNotificationService.getNotificationsByUserForDot(userId)
    if (userNotification){
      return true
    }
    else{
      return false
    }
  }

}
