import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Studio } from '../studio/studio.entity'

export interface CalendarEvent {
  start: Date
  end: Date
  allDay?: boolean,
  index: number
}

@Entity('calendar')
export class CalendarEntity extends BaseEntity {
  @Column()
  studioId: string
  @ManyToOne(type => Studio)
  @JoinColumn()
  studio?: Studio

  @Column({ default: true })
  autoConfirmAppts: boolean

  @Column({ default: [], type: 'jsonb' })
  events: CalendarEvent[]
}
