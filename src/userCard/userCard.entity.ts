import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { User } from '../users/user.entity'
import { BaseEntity } from '../base/base.entity'

@Entity('userCard')
export class UserCard extends BaseEntity {
  @Column()
  name: string

  @Column()
  cardNumber: string

  @Column()
  expMonth: string

  @Column()
  expYear: string
  
  @Column()
  cardToken:string

  @Column()
  brand:string

  @Column()
  userId: string

  @ManyToOne(type => User, { eager: true })
  @JoinColumn()
  user?: User
}