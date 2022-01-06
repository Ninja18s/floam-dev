import { BaseEntity } from '../base/base.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { Location } from '../location/location.entity'
import { User } from '../users/user.entity'
import { Amenity } from './amenity.entity'
import { StudioAddOn } from './studio.addon.entity'
import { STUDIO_STATUS } from './studio.status'

@Entity('studio')
export class Studio extends BaseEntity {
  @Column({ length: 200 })
  name: string

  @Column({ default: STUDIO_STATUS.APPROVED })
  status: STUDIO_STATUS

  @Column({ length: 500, nullable: true })
  description: string

  @Column({ default: [], type: 'jsonb' })
  rules: string[]

  @Column({ type: 'float', default: 0 })
  price: number

  @Column({ type: 'int', default: 0 })
  capacity: number

  @Column({ default: false })
  isLive: boolean // todo: delete this

  @Column({ default: false })
  depositRequired: boolean

  @Column({ length: 500, nullable: true, default: 'Kitchen' })
  studioLocation: string

  @OneToMany(type => StudioAddOn, addOn => addOn.studio, { cascade: true, eager: true })
  addOns: StudioAddOn[]

  @OneToMany(type => Amenity, am => am.studio, { cascade: true, eager: true })
  amenities: Amenity[]

  @OneToOne(type => Location, { nullable: true, cascade: true, eager: true })
  @JoinColumn()
  location: Location | null

  @Column({ default: [], type: 'jsonb' })
  genres: string[]

  @Column({ default: [], type: 'jsonb' })
  artistLevels: string[]

  @Column({ type: 'timestamp', default: null })
  studioOpen: Date | string

  @Column({ type: 'timestamp', default: null })
  studioClose: Date | string

  @Column()
  userId: string

  @ManyToOne(type => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ default: [], type: 'jsonb' })
  hardware: string[]

  @Column({ default: [], type: 'jsonb' })
  software: string[]
  
  @Column({ type: 'int', default: 0 })
  minSessionLength: number
}
