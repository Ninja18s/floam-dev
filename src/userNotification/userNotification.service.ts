import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { groupBy, keys } from 'lodash'
import { Repository } from 'typeorm'
import { User } from '../users/user.entity'
import { userNotificationDto } from './userNotification.dto'
import { UserNotification } from './userNotification.entity'

interface MessageMetaData {
  user: User
  hasUnreadMessage: boolean
}

@Injectable()
export class UserNotificationService {
  private log: Logger = new Logger('UserNotificationService')

  constructor(
    @InjectRepository(UserNotification)
    private readonly userNotificationRepo: Repository<UserNotification>,
  ) { }

  createNotification(text: string, userId: string, type: string, entityId: string) {
    const data = {
      text: text,
      userId: userId,
      type: type,
      entityId: entityId,
      wasRead: false
    }
    return this.userNotificationRepo.save(data)
  }

  async findReadNotification(userNotifications) {
    try {
      for (var notification of userNotifications) {
        notification.wasRead = true;
        this.userNotificationRepo.save(notification)
      }
      return null
    } catch (error) {
      return (error);
    }
  }

  getNotificationsByUser(userId: string) {
    return this.userNotificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  getNotificationsByUserForDot(userId: string) {
    return this.userNotificationRepo.findOne({ where: { userId: userId, wasRead: false } })
}

  async markAsRead(notificationId: string) {
    const notification = await this.userNotificationRepo.findOne({ where: { id: notificationId }})
    if (!notification) {
      this.log.error(`notification not found. id: ${notificationId}`)
      throw new Error('Notification Not found!')
    }
    notification.wasRead = true
    return this.userNotificationRepo.save(notification)
  }
}