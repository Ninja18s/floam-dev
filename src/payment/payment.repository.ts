import { EntityRepository, Repository } from 'typeorm'
import { Payment } from './payment.entity'

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {

  async getByUserId(userId: string) {
    return await this.findOne({
      where: { userId }
    })
  }
}
