import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common'
import { StudioService } from '../studio/studio.service'
import { UserService } from '../users/user.service'
import { CancelApptReq, CreateAppointmentDto, GetApptsToReviewResponse, GetStudioBookings } from './appointment.requests'
import { AppointmentService } from './appointment.service'
import { Appointment } from './appointment.entity'
import { UserNotificationService } from '../userNotification/userNotification.service'
var cron = require('node-cron');
import { PaymentHistoryService } from '../paymentHistory/paymentHistory.service'
import { v1 as uuidv1 } from 'uuid'
import { PaymentService } from '../payment/payment.service'
import { UserCardService } from '../userCard/userCard.service'
import moment = require('moment')

@Controller('appointments')
export class AppointmentController {
  cron: any
  cron2: any
  private log: Logger = new Logger('AppointmentController')

  constructor(
    private studioService: StudioService,
    private appointmentService: AppointmentService,
    private userService: UserService,
    private UserNotificationService: UserNotificationService,
    private paymentHistoryService: PaymentHistoryService,
    private readonly paymentService: PaymentService,
    private readonly userCardService: UserCardService,
  ) {
    this.cron = cron.schedule('*/2 * * * *', async () => {
      let appointments = await this.appointmentService.getAll();
      if (appointments.length > 0) {
        for (var appointment of await appointments) {
          await this.appointmentService.updateAppointment(appointment);
          const studio = await this.studioService.getStudio(appointment.studioId);
          const text = `You have an upcoming session at ${studio.name} in 24 hours`
          await this.UserNotificationService.createNotification(text, appointment.userId, 'upcomingAppointment', appointment.id);
        }
        return null
      }
    });
    if (!this.cron.running) {
      this.cron.start();
    }
    this.cron2 = cron.schedule('*/2 * * * *', async () => {
      let appointments = await this.appointmentService.getApptAll();
      if (appointments.length > 0) {
        for (var appointment of await appointments) {
          await this.appointmentService.updateEarningVariable(appointment);
          const studio = await this.studioService.getStudio(appointment.studioId);
          const user = await this.userService.getUser(studio.userId)
          let studioUserAmount = parseInt(appointment.total) - appointment.floamAmount;
          await this.paymentHistoryService.createPaymentLog(user, null, studioUserAmount, 'managerAmount', appointment.id);
        }
        return null
      }
    });
    if (!this.cron2.running) {
      this.cron2.start();
    }
  }

  @Get('/studios')
  async getStudioBookings(@Query() studioBookingsRequest: GetStudioBookings) {
    const { userId, currentDate, studioId } = studioBookingsRequest
    // const user = await this.userService.getUser(userId)
    const studio = await this.studioService.getStudio(studioId)
    // const studios = await this.studioService.getStudiosByUser(user)

    return this.appointmentService.getBookings(studio.id, currentDate)
  }

  @Get('/studios/:studioId')
  async getAllStudioBookings(@Param('studioId') studioId: string) {
    const studio = await this.studioService.getStudio(studioId)
    return this.appointmentService.getStudioBookings(studio)
  }

  @Post()
  async reserveStudio(@Body() data: CreateAppointmentDto) {
    this.log.log('[POST] reserve studio')
    const { studioId, userId } = data
    const studio = await this.studioService.getStudio(studioId)
    const studioUser = await this.userService.getUser(studio.userId)
    const user = await this.userService.getUser(userId)
    let uuid = await uuidv1();
    let paymentHistory = null;
    data.floamAmount = (20 / 100) * parseInt(data.total);
    let studioUserAmount = parseInt(data.total) - data.floamAmount;
    let charge = await this.paymentHistoryService.createCharge(data, uuid);
    if (charge) {
      paymentHistory = await this.paymentHistoryService.createPaymentLog(user, charge, data.total, null, null);
    }
    else {
      paymentHistory = await this.paymentHistoryService.createPaymentLog(user, null, data.total, null, null);
      return ('Payment Issue: Transaction Failed');
    }
    const text = `${user.firstName} ${user.lastName} has booked your Studio`
    await this.UserNotificationService.createNotification(text, studioUser.id, 'appointmentCreate', studio.id);
    let apptId = await this.appointmentService.createBooking(data, studio, user);
    paymentHistory.appointmentId = apptId;
    await this.paymentHistoryService.saveAppointmentId(paymentHistory);
    const paymentText = `You have recieved payment of $${studioUserAmount} from ${user.firstName} ${user.lastName}`
    await this.UserNotificationService.createNotification(paymentText, studio.userId, 'paymentRecieved', apptId);
    return 'Reservation made successfully!'

  }

  // get appointments without review
  @Get('/users/:userId')
  async getApptsToReview(
    @Param('userId') userId: string
  ): Promise<GetApptsToReviewResponse> {
    // group by reviews to leave for guest and host
    const user = await this.userService.getUser(userId)
    const studios = await this.studioService.getStudiosByUser(user)

    const asGuest = await this.appointmentService.apptsGuestNeedsToReview(user)
    const asHost = await this.appointmentService.apptsHostNeedsToReview(studios)

    return { asGuest, asHost }
  }

  @Post('/cancel')
  async cancelAppointment(@Body() body: CancelApptReq): Promise<Appointment> {
    this.log.log(`processing cancel appointment ...`)
    const { apptId, reason, cancelledByUserId } = body
    await this.appointmentService.cancelAppointment(apptId, reason, cancelledByUserId);
    let appt = await this.appointmentService.getBooking(apptId);
    let studio = await this.studioService.getStudio(appt.studioId);
    const artistUser = await this.userService.getUser(cancelledByUserId);
    const user = await this.userService.getUser(appt.userId);
    let paymentHistory = await this.paymentHistoryService.getPaymentByTransactionId(apptId);
    var startTime = moment(new Date(), 'DD-MM-YYYY hh:mm:ss');
    var endTime = moment(appt.start, 'DD-MM-YYYY hh:mm:ss');
    var hoursDiff = endTime.diff(startTime, 'hours');
    if (paymentHistory) {
      if (artistUser.id === studio.userId) {
        let refund = await this.paymentHistoryService.createRefund(paymentHistory);
        if (refund.status == 'succeeded') {
          await this.paymentHistoryService.createRefundLog(user, null, refund, paymentHistory.amount, 'notRefund', 0, apptId);
        }
      }
      else if (hoursDiff < 24 && artistUser.id != studio.userId) {
        let studioUserAmount = (3 / 100) * paymentHistory.amount;
        let artistUserAmount = paymentHistory.amount - studioUserAmount;
        let refund = await this.paymentHistoryService.createRefund(paymentHistory);
        if (refund.status == 'succeeded') {
          await this.paymentHistoryService.createRefundLog(artistUser, studio.userId, refund, studioUserAmount, 'refund', artistUserAmount, apptId);
        }
      }
      else {
        let refund = await this.paymentHistoryService.createRefund(paymentHistory);
        if (refund.status == 'succeeded') {
          await this.paymentHistoryService.createRefundLog(artistUser, null, refund, paymentHistory.amount, 'notRefund', 0, apptId);
        }
      }
    }
    return appt
  }

  @Post(':apptId/confirm')
  confirmAppointment(@Param('apptId') apptId: string): Promise<Appointment> {
    this.log.log(`processing confirm appointment ...`)
    return this.appointmentService.markApptAsConfirmed(apptId)
  }

  @Post('/create/token') async createChatReport(
    @Body('cardNumber') cardNumber: string,
    @Body('expMonth') expMonth: string,
    @Body('expYear') expYear: string,
    @Body('cvc') cvc: string,
  ) {
    const data = {
      cardNumber: cardNumber,
      expMonth: expMonth,
      expYear: expYear,
      cvc: cvc
    };
    let token = await this.paymentHistoryService.createCardToken(data);
    return token
  }

  @Get('/getTimings/:studioId')
  async getTimings(@Param('studioId') studioId: string) {
    let timings = [];
    let studio = await this.studioService.getStudio(studioId);
    const studioBookings = await this.appointmentService.studioBookings(studio.id);
    const studioCalenders = await this.appointmentService.studioCalenders(studio.id);
    if (studioCalenders && studioCalenders.length > 0) {
      for (var studioCalender of studioCalenders) {
        if (studioCalender.events && studioCalender.events.length > 0) {
          for (var event of studioCalender.events) {
            let data = {
              startTime: event.start,
              endTime: event.end
            }
            timings.push(data)
          }
        }
      }
    }
    if (studioBookings && studioBookings.length > 0) {
      for (var studioBooking of studioBookings) {
        let model = {
          startTime: studioBooking.start,
          endTime: studioBooking.end
        }
        timings.push(model)
      }
    }
    return timings
  }
}
