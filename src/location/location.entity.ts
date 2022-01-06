import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../base/base.entity'

@Entity('location')
export class Location extends BaseEntity {
  @Column()
  addressOne: string

  @Column({ nullable: true })
  addressTwo: string | null

  @Column()
  state: string

  @Column()
  city: string

  @Column()
  zipCode: string

  @Column({ default: null, type: 'float' })
  lat?: number

  @Column({ default: null, type: 'float' })
  lng?: number
}
