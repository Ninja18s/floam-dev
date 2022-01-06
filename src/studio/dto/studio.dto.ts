import { LocationDto } from '../../location/location.dto'
import { BaseDto } from '../../base/base.dto'
import { UserDto } from '../../users/user.dto'
import { Amenity } from '../amenity.entity'
import { StudioAddOn } from '../studio.addon.entity'
import { STUDIO_STATUS } from '../studio.status'

export interface StudioDto extends BaseDto {
  name: string
  status: STUDIO_STATUS
  description: string
  rules: string[]
  price: number
  capacity: number
  rating: number
  reviewsCount: number
  isLive: boolean
  location: LocationDto
  userId: string
  user: Partial<UserDto>
  amenities: Amenity[]
  addOns: StudioAddOn[]
  depositRequired: boolean
  genres: string[]
  studioOpen: Date | string
  studioClose: Date | string
  artistLevels: string[]
  hardware: string[]
  software: string[]
  studioLocation: string,
  minSessionLength: number
}
