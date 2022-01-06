import { Appointment } from '../appointment/appointment.entity'

export interface SessionListDto {
  upcoming: Appointment[]
  previous: Appointment[]
}
