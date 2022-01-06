import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import moment = require('moment')
import { Repository, Between } from 'typeorm'
import { paymentHistoryDto } from './paymentHistory.dto'
import { PaymentHistory } from './paymentHistory.entity'
const stripeTest = require('stripe')('sk_test_51IpFtXBt3PovyCqB7tEHqxxsH6K3OgIqwm2A8TCfYCmk4RGR1GXIMzIKOf3PYdHXdlCgH99NjN1K7UqopENJSyPV00BAV1yJFD');
const stripeProd = require('stripe')('sk_test_MEvj1NP7uAlLRMMWukEMnzV5');
import { paymentFilter } from './paymentHistory.filter'

@Injectable()
export class PaymentHistoryService {
  private log: Logger = new Logger('paymentHistoryService')

  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentHistoryRepo: Repository<PaymentHistory>,
  ) { }

  createPaymentLog(user, charge, total, type, appointmentId) {
    let data = null;
    if (charge && charge.amount) {
      data = {
        userId: user.id,
        amount: total,
        transactionId: charge.id,
        status: 'paid',
        text: 'amount paid'
      };
    }
    else if (type) {
      data = {
        userId: user.id,
        amount: total,
        transactionId: null,
        status: 'succeeded',
        text: 'amount received',
        appointmentId: appointmentId
      };
    }
    else {
      data = {
        userId: user.id,
        amount: total,
        transactionId: null,
        status: 'failed',
        text: 'amount failed'
      };
    }
    return this.paymentHistoryRepo.save(data)
  }

  createRefundLog = async (user, studioUserId, charge, total, type, artistUserAmount, apptId) => {
    let artistUser = null;
    let studioUser = null;
    if (type == 'refund') {
      if (charge && charge.amount) {
        artistUser = {
          userId: user.id,
          amount: artistUserAmount,
          transactionId: charge.id,
          status: 'succeeded',
          text: 'amount refunded',
          appointmentId: apptId
        };
        studioUser = {
          userId: studioUserId,
          amount: total,
          transactionId: charge.id,
          status: 'succeeded',
          text: 'amount refunded',
          appointmentId: apptId
        };
      }
      await this.paymentHistoryRepo.save(studioUser);
      await this.paymentHistoryRepo.save(artistUser);
      return
    }
    else if (type == 'notRefund') {
      if (charge && charge.amount) {
        artistUser = {
          userId: user.id,
          amount: total,
          transactionId: charge.id,
          status: 'succeeded',
          text: 'amount refunded',
          appointmentId: apptId
        };
      }
      return this.paymentHistoryRepo.save(artistUser)
    }
  }

  saveAppointmentId(paymentHistory) {
    return this.paymentHistoryRepo.save(paymentHistory)
  }

  createCharge = async (data, uniqueKey) => {
    return new Promise(async (resolve, reject) => {
      stripeTest.charges.create(
        {
          amount: parseInt(data.total) * 100,
          currency: 'usd',
          source: data.cardToken,
          description: 'charge for appointment',
          metadata: { order_id: data.studioId },
        },
        {
          idempotency_key: uniqueKey,
        },
        function (err, charge) {
          if (err) {
            return reject(err.message);
          }
          return resolve(charge);
        }
      );
    });
  };

  createCardToken = async (data) => {
    const token = await stripeTest.tokens.create({
      card: {
        number: data.cardNumber,
        exp_month: data.expMonth,
        exp_year: data.expYear,
        cvc: data.cvc,
      },
    });
    return (token)
  };

  getPaymentByUser(userId: string) {
    return this.paymentHistoryRepo.find({
      where: { userId }
    })
  }

  getPaymentByTransactionId(appointmentId: string) {
    return this.paymentHistoryRepo.findOne({
      where: { appointmentId: appointmentId, status: 'paid' }
    })
  }

  getDayEarning = async (date, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        var startMonth = moment(date).startOf("day");
        var endMonth = moment(date).endOf('day');
        let payments = await this.paymentHistoryRepo.find({
          where: {
            createdAt: Between(startMonth, endMonth),
            userId: userId
          }
        });
        let totalAmount = 0;
        if (payments.length > 0) {
          for (var payment of payments) {
            totalAmount = totalAmount + payment.amount;
          }
        }

        return resolve(totalAmount);
      } catch (err) {
        return resolve(null);
      }
    })
  }

  getWeekEarning = async (date, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        var startMonth = moment(date).startOf("week");
        var endMonth = moment(date).endOf('week');
        let payments = await this.paymentHistoryRepo.find({
          where: {
            createdAt: Between(startMonth, endMonth),
            userId: userId
          }
        });
        let totalAmount = 0;
        if (payments.length > 0) {
          for (var payment of payments) {
            totalAmount = totalAmount + payment.amount;
          }
        }

        return resolve(totalAmount);
      } catch (err) {
        return resolve(null);
      }
    })
  }

  getMonthEarning = async (date, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        var startMonth = moment(date).startOf("month");
        var endMonth = moment(date).endOf('month');
        let payments = await this.paymentHistoryRepo.find({
          where: {
            createdAt: Between(startMonth, endMonth),
            userId: userId
          }
        });
        let totalAmount = 0;
        if (payments.length > 0) {
          for (var payment of payments) {
            totalAmount = totalAmount + payment.amount;
          }
        }

        return resolve(totalAmount);
      } catch (err) {
        return resolve(null);
      }
    })
  }

  createRefund = async (data) => {
    const refund = await stripeTest.refunds.create({
      charge: data.transactionId,
    });
    return (refund)
  };

  async getEarnings(userId: string): Promise<string> {
    let data: any
    let day = [];
    let week = [];
    let month = [];
    let ytd = [];
    let model = {}

    var date7 = moment(new Date());
    var date6 = moment(new Date()).subtract(1, "day");
    var date5 = moment(new Date()).subtract(2, "day");
    var date4 = moment(new Date()).subtract(3, "day");
    var date3 = moment(new Date()).subtract(4, "day");
    var date2 = moment(new Date()).subtract(5, "day");
    var date1 = moment(new Date()).subtract(6, "day");

    const day1 = await this.getDayEarning(date1, userId);
    model = {
      day: moment(date1).format('D/M/YY'),
      earnings: day1,
      label: day1
    }
    day.push(model);
    const day2 = await this.getDayEarning(date2, userId);
    model = {
      day: moment(date2).format('D/M/YY'),
      earnings: day2,
      label: day2
    }
    day.push(model);
    const day3 = await this.getDayEarning(date3, userId);
    model = {
      day: moment(date3).format('D/M/YY'),
      earnings: day3,
      label: day3
    }
    day.push(model);
    const day4 = await this.getDayEarning(date4, userId);
    model = {
      day: moment(date4).format('D/M/YY'),
      earnings: day4,
      label: day4
    }
    day.push(model);
    const day5 = await this.getDayEarning(date5, userId);
    model = {
      day: moment(date5).format('D/M/YY'),
      earnings: day5,
      label: day5
    }
    day.push(model);
    const day6 = await this.getDayEarning(date6, userId);
    model = {
      day: moment(date6).format('D/M/YY'),
      earnings: day6,
      label: day6
    }
    day.push(model);
    const day7 = await this.getDayEarning(date7, userId);
    model = {
      day: moment(date7).format('D/M/YY'),
      earnings: day7,
      label: day7
    }
    day.push(model);

    var date4 = moment(new Date());
    var date3 = moment(new Date()).subtract(1, "week");
    var date2 = moment(new Date()).subtract(2, "week");
    var date1 = moment(new Date()).subtract(3, "week");

    const week1 = await this.getWeekEarning(date1, userId);
    model = {
      day: moment(date1).format('D/M/YY'),
      earnings: week1,
      label: week1
    }
    week.push(model);
    const week2 = await this.getWeekEarning(date2, userId);
    model = {
      day: moment(date2).format('D/M/YY'),
      earnings: week2,
      label: week2
    }
    week.push(model);
    const week3 = await this.getWeekEarning(date3, userId);
    model = {
      day: moment(date3).format('D/M/YY'),
      earnings: week3,
      label: week3
    }
    week.push(model);
    const week4 = await this.getWeekEarning(date4, userId);
    model = {
      day: moment(date4).format('D/M/YY'),
      earnings: week4,
      label: week4
    }
    week.push(model);

    var date3 = moment(new Date());
    var date2 = moment(new Date()).subtract(1, "month");
    var date1 = moment(new Date()).subtract(2, "month");

    const month1 = await this.getMonthEarning(date1, userId);
    model = {
      day: moment(date1).format('MMM'),
      earnings: month1,
      label: month1
    }
    month.push(model);
    const month2 = await this.getMonthEarning(date2, userId);
    model = {
      day: moment(date2).format('MMM'),
      earnings: month2,
      label: month2
    }
    month.push(model);
    const month3 = await this.getMonthEarning(date3, userId);
    model = {
      day: moment(date3).format('MMM'),
      earnings: month3,
      label: month3
    }
    month.push(model);

    const payments = await this.getPaymentByUser(userId);
    var totalAmount = 0;
    if (payments.length > 0) {
      for (var payment of payments) {
        totalAmount = totalAmount + payment.amount;
      }
    }
    model = {
      day: null,
      earnings: totalAmount
    }
    ytd.push(model);

    data = {
      day: day,
      week: week,
      month: month,
      ytd: ytd
    }
    return data
  }
}