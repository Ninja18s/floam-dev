import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Studio } from '../studio/studio.entity'
import { User } from '../users/user.entity'

@Entity('favorite')
export class Favorite extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId?: string

  @ManyToOne(type => User)
  @JoinColumn()
  user: User

  @Column({ type: 'uuid', name: 'studio_id', nullable: true })
  studioId?: string

  @ManyToOne(type => Studio)
  @JoinColumn()
  studio: Studio
}
