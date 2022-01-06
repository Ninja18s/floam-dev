import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Between, LessThanOrEqual, MoreThan, Repository,Not,MoreThanOrEqual } from 'typeorm'
import { CalendarService } from '../calendar/calendar.service'
import { CommunicationService } from '../communication/communication.service'
import { Studio } from '../studio/studio.entity'
import { SessionListDto } from '../users/SessionListDto'
import { User } from '../users/user.entity'
import { DATE_FORMAT } from '../utils/common'
import { Appointment, APPT_STATUSES } from './appointment.entity'
import { CreateAppointmentDto, GetStudioBookingsResponse } from './appointment.requests'
import moment = require('moment')
import { UserNotificationService } from '../userNotification/userNotification.service'
import { UserService } from '../users/user.service'
import { format as formatDate } from 'date-fns'
import { StudioService } from '../studio/studio.service'

@Injectable()
export class AppointmentService {
  private logger: Logger = new Logger('AppointmentService')

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly commsService: CommunicationService,
    private readonly calendarService: CalendarService,
    private userService: UserService,
    private UserNotificationService: UserNotificationService,
    private studioService: StudioService,
  ) { }

  createOrUpdate(appt: Appointment) {
    return this.appointmentRepo.save(appt)
  }

  async getBooking(appointmentId: string) {
    const appt = await this.appointmentRepo.findOne(appointmentId)
    if (!appt) {
      throw new Error('Appointment not found.')
    }
    return appt
  }
  
  async studioBookings(studioId: string) {
    var currentTime = moment(new Date).format();
    const appts = await this.appointmentRepo.find({
      where: {
        studioId: studioId,
        start: MoreThanOrEqual(currentTime),
        status: Not('requested')
      }
    })
    return appts
  }

  async studioCalenders(studioId: string) {
    const studioCalenders = await this.calendarService.studioCalenders(studioId);
    return studioCalenders
  }

  // todo: add function to calculate which dates in a month have appointments
  // use this for indicator

  async getBookings(studioId, currentDate: string): Promise<GetStudioBookingsResponse> {
    const start = moment(currentDate, DATE_FORMAT).startOf('week').startOf('day')
    const end = start.clone().endOf('week').endOf('day')

    const bookings: Appointment[] = []
      const studioBookings = await this.appointmentRepo.find({
        where: {
          studioId,
          start: Between(start, end),
          cancelledAt: null,
        },
        relations: ['studio', 'user', 'addOns']
      })
      bookings.push(...studioBookings)

    this.logger.debug('\n\n')
    this.logger.debug('****** bookings found ******')
    this.logger.debug(bookings)
    this.logger.debug('****** bookings found ******\n\n')

    const groupedByStartDate: GetStudioBookingsResponse = {}
    while (start.isSameOrBefore(end)) {
      const date = start.clone().format(DATE_FORMAT)
      groupedByStartDate[date] = []
      start.add(1, 'd')
    }
    this.logger.debug(groupedByStartDate)

    bookings.forEach(booking => {
      const date = moment(booking.start).format(DATE_FORMAT)
      groupedByStartDate[date].push(booking)
    })

    this.logger.debug('\ngroupedByStartDate with bookings')
    this.logger.debug(groupedByStartDate)

    return groupedByStartDate
  }

  async getBookingsForUser(user: User): Promise<SessionListDto> {
    const upComingSessions: Appointment[] = await this.appointmentRepo.find({
      where: {
        user,
        end: MoreThan(new Date()),
        // status: Not('cancelled')
      },
      order: { start: 'ASC' },
      relations: ['studio'],
    })
    this.logger.debug('*** upcoming sessions ***')
    this.logger.debug(upComingSessions)
    this.logger.debug('*** upcoming sessions ***')

    const previousSessions: Appointment[] = await this.getPreviousAppointments(user)
    this.logger.debug('*** previous sessions ***')
    this.logger.debug(upComingSessions)
    this.logger.debug('*** previous sessions ***')

    return {
      upcoming: upComingSessions,
      previous: previousSessions,
    }
  }

  getStudioBookings(studio: Studio): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { studio },
      order: { start: 'ASC' },
      relations: ['studio', 'user']
    })
  }

  async createBooking(
    data: CreateAppointmentDto,
    studio: Studio,
    user: User,
  ): Promise<string> {
    this.logger.log(`[creteBooking] ...`)
    /*
     * todo: @ade verify these
     *  - timeslot has not been booked
     *  - does not overlap with over appointments
     *  - free up time block if appointment is cancelled
     */
    const calendar = await this.calendarService.setupForStudio(studio.id)
    const { startDateTime, endDateTime, total, addOns, notes, numOfGuests,floamAmount } = data

    const start = new Date(startDateTime)
    const end = new Date(endDateTime)
    let appt: Appointment = {
      start,
      end,
      studio,
      user,
      total,
      cancelledAt: null,
      cancellationReason: '',
      artistLeftReview: false,
      hostLeftReview: false,
      addOns,
      notes,
      numOfGuests,
      status: calendar.autoConfirmAppts ? APPT_STATUSES.CONFIRMED : APPT_STATUSES.PENDING,
      userId: user.id,
      studioId: studio.id,
      notificationSent: false,
      isEarning: false,
      floamAmount
    }

    appt = await this.createOrUpdate(appt)
    this.logger.log(`[creteBooking] appointment successfully created`)
    // await this.commsService.sendNewApptNotice(createdAppt)
    return appt.id
  }

  async getPreviousAppointments(user: User): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: {
        user,
        end: LessThanOrEqual(new Date()),
        // status: Not('cancelled')
      },
      order: { start: 'ASC' },
      relations: ['studio', 'user'],
    })
  }

  async apptsGuestNeedsToReview(user: User) {
    let appointments = await this.getPreviousAppointments(user)
    appointments = appointments.filter(a => !a.artistLeftReview)
    return (appointments.reverse())
  }

  async apptsHostNeedsToReview(studios: Studio[]) {
    let appointments: Appointment[] = []

    for (const studio of studios) {
      const studioAppts = await this.getStudioBookings(studio)
      appointments.push(...studioAppts)
    }

    appointments = appointments.filter(a => !a.hostLeftReview)
    return (appointments.reverse())
  }

  async cancelAppointment(
    apptId: string,
    reason: string,
    cancelledByUserId: string,
  ) {
    let appt = await this.getBooking(apptId)

    appt.status = APPT_STATUSES.CANCELLED
    appt.cancelledAt = new Date()
    appt.cancellationReason = reason
    appt.cancelledByUserId = cancelledByUserId

    appt = await this.createOrUpdate(appt)

    const user = await this.userService.getUser(appt.cancelledByUserId)
    const studio = await this.studioService.getStudio(appt.studioId)
    const formattedDate = formatDate(appt.start, 'MMM dd, yyyy')
    if (user.id == studio.userId){
      const text = `${studio.name} has cancelled your booking on ${formattedDate}. Refund has been initiated for the same booking.`
      await this.UserNotificationService.createNotification(text, appt.userId, 'appointmentCancel', appt.id);
    } 
    else {
      const text = `${user.firstName} ${user.lastName} cancelled their session on ${formattedDate}.`
      await this.UserNotificationService.createNotification(text, studio.userId, 'appointmentCancel', appt.id);
    }
    // await this.commsService.sendApptCancelledNotice(appt, cancelledByUserId)
    return appt
  }

  async markApptAsConfirmed(apptId: string) {
    let appt = await this.getBooking(apptId)
    appt.status = APPT_STATUSES.CONFIRMED
    appt = await this.createOrUpdate(appt)

    const user = await this.userService.getUser(appt.userId)
    const text = `Your session has been confirmed.`
    await this.UserNotificationService.createNotification(text, user.id, 'appointmentConfirmed', appt.id);

    // await this.commsService.sendApptConfirmedNotice(appt)
    return appt
  }

  async getAll() {
    try {
      const startDate = moment().format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment().add(24,"hours").format("YYYY-MM-DD HH:mm:ss");
      const upComingSessions: Appointment[] = await this.appointmentRepo.find({ where: { start: Between ( startDate, endDate ), notificationSent: false  }});
      return (upComingSessions)
    } catch (error) {
      console.log(error)
    }
  }

  async getApptAll() {
    try {
      const startDate = moment().subtract(48,"hours").format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment().subtract(24,"hours").format("YYYY-MM-DD HH:mm:ss");
      const bookings: Appointment[] = await this.appointmentRepo.find({ where: { end: Between ( startDate, endDate), isEarning: false, status: 'confirmed'  }});
      return (bookings)
    } catch (error) {
      console.log(error)
    }
  }

  async updateAppointment(appointment) {
    appointment.notificationSent = true;
    await this.createOrUpdate(appointment)
    return null
  }
  async updateEarningVariable(appointment) {
    appointment.isEarning = true;
    await this.createOrUpdate(appointment)
    return null
  }
}
