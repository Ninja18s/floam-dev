import { BaseEntity } from '../base/base.entity'
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { StudioAddOn } from '../studio/studio.addon.entity'
import { Studio } from '../studio/studio.entity'
import { User } from '../users/user.entity'
import { float } from 'aws-sdk/clients/lightsail'

export enum APPT_STATUSES {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('appointment')
export class Appointment extends BaseEntity {
  @Column({ type: 'timestamp' })
  start: Date

  @Column({ type: 'timestamp' })
  end: Date

  @Column({ type: 'decimal', default: 0.00, nullable: true })
  total: string

  @Column()
  studioId: string

  @ManyToOne(type => Studio)
  studio?: Studio

  @Column()
  userId: string

  @ManyToOne(type => User)
  user?: User

  @Column({ default: false })
  hostLeftReview: boolean

  @Column({ default: false })
  artistLeftReview: boolean

  @Column({ default: null })
  cancelledAt?: Date

  @Column({ default: null })
  cancellationReason?: string

  @Column({ default: null })
  cancelledByUserId?: string

  @ManyToMany(type => StudioAddOn)
  @JoinTable({
    name: 'appointment_add_ons',
    joinColumn: { name: 'appointment_id' },
    inverseJoinColumn: { name: 'add_on_id' },
  })
  addOns: StudioAddOn[]

  @Column({ nullable: true })
  notes?: string

  @Column({ default: 0 })
  numOfGuests: number

  @Column({ default: APPT_STATUSES.PENDING })
  status: APPT_STATUSES
  
  @Column({ default: false })
  notificationSent: boolean

  @Column({ default: false })
  isEarning: boolean

  @Column({ type: 'decimal', default: 0.00, nullable: true })
  floamAmount: float
}
