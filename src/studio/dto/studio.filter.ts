import { STUDIO_STATUS } from '../studio.status'

export interface StudioFilter {
  statuses: STUDIO_STATUS[]
  fetchAll?: boolean
  zipCode?: number
  latitude?: number
  longitude?: number
  minPrice?: number
  maxPrice?: number
  userId?: string
  maxDistance?: number // in miles
  guests?: number
  offSet?: number
  limit?:number
}
