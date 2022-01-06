import { BaseDto } from '../../base/base.dto'

export interface AmenityDto extends BaseDto {
  isActive: boolean
  description: string
  iconName: string
}
