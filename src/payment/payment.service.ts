import { Injectable, Logger } from '@nestjs/common'
import { User } from '../users/user.entity'
import { Payment, PaymentCard } from './payment.entity'
import { Card, CreateCardDto } from './payment.objects'
import { PaymentRepository } from './payment.repository'
import stripeClient, { createUserInStripe, Stripe } from './stripeClient'

type StripeCard = Extract<Stripe.CustomerSource, Stripe.Card>

@Injectable()
export class PaymentService {
  private log: Logger = new Logger('PaymentService')

  constructor(
    private readonly paymentRepo: PaymentRepository,
  ) { }

  async create(user: User) {
    const stripeCustomerId = await createUserInStripe(user)
    const payment: Payment = {
      stripeCustomerId,
      userId: user.id,
      cards: [],
    }
    return this.paymentRepo.save(payment)
  }

  async deleteCard(userId: string, cardId: string) {
    const payment = await this.paymentRepo.getByUserId(userId)
    payment.cards = payment.cards.filter(card => card.cardId !== cardId)
    return await this.paymentRepo.save(payment)
  }

  async processPayment(userId: string, amount: number) { }

  async registerCard(data: CreateCardDto): Promise<Payment> {
    const { location, userId, isDefault } = data
    const payment = await this.paymentRepo.getByUserId(userId)
    if (!payment) {
      this.log.error(`User '${userId}' payment not found.`)
      throw new Error('Something went wrong.')
    }

    const tokenCreateParams: Stripe.TokenCreateParams = {
      card: {
        name: data.name,
        number: data.number,
        exp_month: data.expMonth,
        exp_year: data.expYear,
        cvc: data.cvc,
        address_city: location.city,
        address_line1: location.addressOne,
        address_line2: location.addressTwo,
        address_state: location.state,
        address_country: 'US',
        address_zip: location.zipCode,
      }
    }

    try {
      const cardToken: Stripe.Token = await stripeClient.tokens.create(tokenCreateParams)
      const source: Stripe.CustomerSource = await stripeClient.customers.createSource(
        payment.stripeCustomerId,
        { source: cardToken.id }
      )

      payment.cards.push({ cardId: source.id, isDefault })
      return await this.paymentRepo.save(payment)
    } catch (e) {
      this.log.error(e)
      throw e
    }
  }

  async getCards(userId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { userId }
    })

    const response: Card[] = []
    if (payment && payment.cards) {
      for (const pCard of payment.cards) {
        const card = await this.transformToCard(payment.stripeCustomerId, pCard)
        response.push(card)
      }
    }
    return response
  }

  async transformToCard(customerId: string, pCard: PaymentCard): Promise<Card> {
    // @ts-ignore
    const source: StripeCard = await stripeClient.customers.retrieveSource(customerId, pCard.cardId)

    return {
      brand: source.brand,
      last4: source.last4,
      expMonth: source.exp_month,
      expYear: source.exp_year,
      isDefault: pCard.isDefault,
      cardId: pCard.cardId,
    }
  }
}
