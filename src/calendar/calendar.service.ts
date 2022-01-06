import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CalendarEntity, CalendarEvent } from './calendar.entity'

@Injectable()
export class CalendarService {
  private log: Logger = new Logger('CalendarService')

  constructor(
    @InjectRepository(CalendarEntity)
    private calendarRepo: Repository<CalendarEntity>,
  ) {}

  async getByStudio(studioId: string) {
    const calendar = await this.calendarRepo.findOne({ studioId })
    if (!calendar) {
      this.log.error(`Calendar for studio not found. studioId: ${studioId}`)
      throw new Error(`Calendar for studio not found.`)
    }

    return calendar
  }

  async saveEvent(studioId: string, event: CalendarEvent) {
    const calendar = await this.getByStudio(studioId)
    event.index = calendar.events.length;
    calendar.events.push(event)
    return this.calendarRepo.save(calendar)
  }

  async removeEvent(studioId: string, event: CalendarEvent) {
    const calendar = await this.getByStudio(studioId)
    calendar.events = calendar.events.filter(e => e.index !== event.index)
    return this.calendarRepo.save(calendar)
  }

  async setupForStudio(studioId: string) {
    try {
      return await this.getByStudio(studioId)
    } catch (error) {
      if (error.message === 'Calendar for studio not found.') {
        // create a new one
        const calendar: CalendarEntity = {
          studioId,
          autoConfirmAppts: true,
          events: []
        }

        return this.calendarRepo.save(calendar)
      }

      this.log.error(`[setupForStudio] ${error.message}`)
    }
  }

  async setAutoConfirmAppointment(studioId: string, autoConfirm: boolean) {
    const calendar = await this.getByStudio(studioId)
    calendar.autoConfirmAppts = autoConfirm
    return this.calendarRepo.save(calendar)
  }

  async studioCalenders(studioId: string) {
    const studios = await this.calendarRepo.find({
      where: {
        studioId: studioId
      }
    })
    return studios
  }
}
