import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Appointment } from '../appointment/appointment.entity'
import { BaseEntity } from '../base/base.entity'
import { Studio } from '../studio/studio.entity'
import { User } from '../users/user.entity'

export enum LEFT_BY_TYPES {
  ARTIST = 'artist',
  STUDIO_MANAGER = 'studio_manager',
}

@Entity('review')
export class Review extends BaseEntity {
  @Column('float')
  rating: number

  @Column('float')
  cleanlinessRating: number

  @Column('float')
  timelinessRating: number

  @Column('float')
  communicationRating: number

  @Column({ default: false })
  isExpectations: boolean

  @Column({ default: false })
  isRecommendations: boolean

  @Column({ length: 600 })
  comment: string

  @Column({ length: 600, nullable: true, default: null })
  privateComment: string | null

  @Column()
  studioId: string

  @ManyToOne(type => Studio)
  @JoinColumn()
  studio?: Studio

  @Column()
  appointmentId: string

  @ManyToOne(type => Appointment)
  @JoinColumn()
  appointment?: Appointment

  @Column()
  leftByUserType: LEFT_BY_TYPES

  @Column()
  leftByUserId: string

  @ManyToOne(type => User)
  @JoinColumn({ name: 'left_by_user_id' })
  leftByUser?: User
}
