import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'
import { BaseEntity } from '../base/base.entity'

@Entity('message')
export class Message extends BaseEntity {
  @Column()
  senderId: string

  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  sender?: User

  @Column()
  receiverId: string
  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  receiver?: User

  @Column()
  content: string

  @Column()
  wasRead: boolean
}
