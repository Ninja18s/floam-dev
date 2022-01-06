import { BaseEntity } from '../base/base.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Studio } from '../studio/studio.entity'

@Entity('schedule')
export class Schedule extends BaseEntity {
  @Column()
  date: string // should this be a date object?

  @Column()
  startTime: string // 24:00. military time

  @Column()
  endTime: string

  @Column()
  timezone: string

  @ManyToOne(type => Studio, studio => studio)
  studio: Studio
}
