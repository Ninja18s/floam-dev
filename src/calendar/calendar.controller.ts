import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common'
import { CalendarEvent } from './calendar.entity'
import { CalendarService } from './calendar.service'

@Controller('calendars')
export class CalendarController {
  private log: Logger = new Logger('CalendarController')

  constructor(
    private calendarService: CalendarService,
  ) {}

  @Get('studios/:studioId')
  async getCalendarForStudio(@Param('studioId') studioId: string) {
    this.log.log(`[GET] getCalendarForStudio`)
    await this.calendarService.setupForStudio(studioId)
    return this.calendarService.getByStudio(studioId)
  }

  @Post('studios/:studioId/events')
  async addEventToCalendar(
    @Param('studioId') studioId: string,
    @Body() event: CalendarEvent,
  ) {
    this.log.log(`[POST] addEventToCalendar`)
    await this.calendarService.setupForStudio(studioId)
    return this.calendarService.saveEvent(studioId, event)
  }

  @Delete('studios/:studioId/events')
  async removeEventFromCalendar(
    @Param('studioId') studioId: string,
    @Body() event: CalendarEvent,
  ) {
    this.log.log(`[DELETE] removeEventFromCalendar`)
    await this.calendarService.setupForStudio(studioId)
    return this.calendarService.removeEvent(studioId, event)
  }

  @Post('studios/:studioId/auto-confirm')
  async toggleAutoConfirm(
    @Param('studioId') studioId: string,
    @Body('autoConfirm') autoConfirm: boolean,
  ) {
    this.log.log(`[POST] toggleAutoConfirm`)
    await this.calendarService.setupForStudio(studioId)
    return this.calendarService.setAutoConfirmAppointment(studioId, autoConfirm)
  }
}
