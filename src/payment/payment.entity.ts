import { Column, Entity, OneToOne } from 'typeorm'
import { BaseEntity } from '../base/base.entity'
import { User } from '../users/user.entity'

export interface PaymentCard {
  cardId: string
  isDefault: boolean
}

@Entity('payment')
export class Payment extends BaseEntity {
  @Column()
  userId: string

  @OneToOne( type => User)
  user?: User

  @Column()
  stripeCustomerId: string

  @Column('jsonb')
  cards: PaymentCard[]
}
