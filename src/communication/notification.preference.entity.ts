import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { User } from '../users/user.entity'

export enum NotificationPreferenceTypes {
  REMINDERS = 'REMINDERS',
  MESSAGES = 'MESSAGES',
  PROMOTIONS = 'PROMOTIONS',
  SUPPORT = 'SUPPORT',
}

@Entity('notification_preferences')
export class NotificationPreference extends BaseEntity {
  @Column()
  type: NotificationPreferenceTypes

  @Column({ default: true })
  email: boolean

  @Column({ default: true })
  sms: boolean

  @Column({ default: true })
  push: boolean

  @Column()
  userId: string

  @ManyToOne(type => User)
  user: User
}
