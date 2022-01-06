import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'
import { BaseEntity } from '../base/base.entity'

@Entity('support')
export class Support extends BaseEntity {
  @Column()
  text: string

  @Column()
  type: string

  @Column()
  userId: string

  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  user?: User
}