import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { Studio } from '../studio/studio.entity'
import { User } from '../users/user.entity'

@Entity('flagged_studios')
export class FlagStudio extends BaseEntity {
  @Column()
  studioId: string

  @ManyToOne(type => Studio)
  @JoinColumn()
  studio: Studio

  @Column()
  userId: string

  @ManyToOne(type => User)
  @JoinColumn()
  user: User
}
