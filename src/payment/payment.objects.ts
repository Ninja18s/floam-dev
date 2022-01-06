import { Location } from '../location/location.entity'

export interface CreateCardDto {
  userId: string
  isDefault: boolean
  number: string
  expMonth: string
  expYear: string
  cvc: string
  location: Location
  name: string
}

export interface Card {
  brand: string // visa, mastercard, amex, etc
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
  cardId: string
}
