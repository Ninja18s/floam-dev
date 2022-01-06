import { BaseDto } from '../base/base.dto'

export interface LocationDto extends BaseDto {
  addressOne: string
  addressTwo: string | null
  state: string
  city: string
  zipCode: string
}
