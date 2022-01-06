import { LocationDto } from '../../location/location.dto'
import { StudioAddOn } from '../studio.addon.entity'
import { AmenityDto } from './amenity.dto'

interface PhotoData {
  uri: string,
  height?: number,
  width?: number,
  placeholder?: boolean
}

export enum ARTIST_LEVELS {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface StudioRegistrationDto {
  userId: string
  studioId?: string
  status?: string
  name?: string
  price?: number
  capacity?: number
  description?: string
  rules?: string[]
  location?: LocationDto
  amenities?: AmenityDto[]
  addOns?: StudioAddOn[]
  photos?: PhotoData[]
  depositRequired?: boolean
  minSessionLength: number
  studioOpen: Date
  studioClose: Date
  genres: string[]
  artistLevels: string[]
  hardware: string[]
  software: string[]
  studioLocation: string,
}
