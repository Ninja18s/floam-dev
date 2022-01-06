import { BaseEntity } from '../base/base.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Studio } from './studio.entity'

@Entity('amenity')
export class Amenity extends BaseEntity {
  @Column()
  isActive: boolean

  @Column()
  description: string

  @Column({ nullable: true })
  iconName: string

  @ManyToOne(type => Studio)
  @JoinColumn({ name: 'studio_id' })
  studio?: Studio
}
