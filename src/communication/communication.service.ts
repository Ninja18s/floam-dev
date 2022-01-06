import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { format as formatDate } from 'date-fns'
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk'
import moment = require('moment')
import { Repository } from 'typeorm'
import { AppGateway } from '../app/app.gateway'
import { Appointment, APPT_STATUSES } from '../appointment/appointment.entity'
import { User } from '../users/user.entity'
import { NotificationPreference, NotificationPreferenceTypes } from './notification.preference.entity'

export enum NOTIFICATIONS {
  APPT_NEW = 1,
  APPT_CONFIRMED,
  APPT_CANCELLED,
}

const MessagesMap = {
  [NOTIFICATIONS.APPT_NEW]: `Congratulations! someone booked a new session at your studio.`,
  [NOTIFICATIONS.APPT_CONFIRMED]: `Awesome! your session has confirmed.`,
  [NOTIFICATIONS.APPT_CANCELLED]: `Oh no! your session was cancelled.`,
}

// todo: @ade move logic in here to job processor to prevent network request from blocking
@Injectable()
export class CommunicationService {
  private expoClient: Expo
  private log: Logger = new Logger('CommunicationService')

  constructor(
    @InjectRepository(NotificationPreference)
    private notificationPreferencesRepo: Repository<NotificationPreference>,
    private appGateway: AppGateway,
  ) {
    this.expoClient = new Expo()
  }

  async createDefaultNotificationPreferences(user: User): Promise<NotificationPreference[]> {
    const preferences: NotificationPreference[] = []
    Object.keys(NotificationPreferenceTypes).forEach(type => {
      const preference: NotificationPreference = {
        type: NotificationPreferenceTypes[type],
        userId: user.id,
        user,
        email: true,
        sms: true,
        push: true,
      }
      preferences.push(preference)
    })

    return await this.notificationPreferencesRepo.save(preferences)
  }

  getNotificationPreferences(userId: string): Promise<NotificationPreference[]> {
    return this.notificationPreferencesRepo.find({
      where: { userId }
    })
  }

  saveNotificationPreference(preference: NotificationPreference): Promise<NotificationPreference> {
    return this.notificationPreferencesRepo.save(preference)
  }

  async sendNewApptNotice(appt: Appointment) {
    // send to studio owner
    const { user: { pushToken } } = appt.studio
    const msg = MessagesMap[NOTIFICATIONS.APPT_NEW]
    await this.sendPushNotification(pushToken, msg)

    // if the status is confirmed, send to artist as well
    if (appt.status === APPT_STATUSES.CONFIRMED) {
      await this.sendApptConfirmedNotice(appt)
    }
  }

  async sendApptConfirmedNotice(appt: Appointment) {
    const { user: { pushToken }, start, } = appt
    const formattedDate = formatDate(start, 'MMM do, yyyy @ hh:mm aa')
    const msg = `Your appointment on ${formattedDate} has been confirmed.`
    console.log(msg)
    await this.sendPushNotification(pushToken, msg)
    this.log.log(`Successfully sent ApptConfirmed notice`)
  }

  async sendApptCancelledNotice(appt: Appointment, cancelledByUserId: string) {
    const {
      start,
      user: { id: artistId, pushToken: artistPushToken },
      studio: { id: managerId, user: { pushToken: managerPushToken } },
    } = appt
    const formattedDate = formatDate(start, 'MMM do, yyyy @ hh:mm aa')

    if (cancelledByUserId === artistId) {
      // notify the manager of the cancellation
      const msg = `Oh no! The artist cancelled their appointment for ${formattedDate}.`
      await this.sendPushNotification(managerPushToken, msg)
      this.log.log(`Successfully sent ApptCancelled:ByArtist notice`)
    } else if (cancelledByUserId === managerId) {
      // notify the artist of the cancellation
      const msg = `Oh no! Your appointment on ${formattedDate} has been cancelled.`
      await this.sendPushNotification(artistPushToken, msg)
      this.log.log(`Successfully sent ApptCancelled:ByManager notice`)
    }
  }

  notifyDevice(userId: string) {
    // check if the client is connected
    const sentIndicator = this.appGateway.notifyClients(userId)
    this.log.debug(`was the device notified? ${sentIndicator}`)
    // todo: @ade send push if not connected
  }

  private async sendPushNotification(token: string, body: string) {
    if (!Expo.isExpoPushToken(token)) {
      this.log.error(`Push token ${token} is not a valid Expo push token`)
      // todo: should we throw an exception here?
      return
    }

    const message: ExpoPushMessage = {
      to: token,
      sound: 'default',
      body,
      // data: { withSome: 'data' },
    }

    const tickets: ExpoPushTicket[] = await this.expoClient.sendPushNotificationsAsync([message])
    this.log.debug(tickets)
  }
}
