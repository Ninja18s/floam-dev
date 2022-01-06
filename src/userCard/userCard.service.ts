import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentHistoryService } from '../paymentHistory/paymentHistory.service'
import { Repository } from 'typeorm'
import { User } from '../users/user.entity'
import { userCardDto } from './userCard.dto'
import { UserCard } from './userCard.entity'

@Injectable()
export class UserCardService {
  private log: Logger = new Logger('UserCardService')

  constructor(
    @InjectRepository(UserCard)
    private readonly UserCardServiceRepo: Repository<UserCard>,
    private paymentHistoryService: PaymentHistoryService,
  ) { }

  createCard = async (dto: userCardDto) => {
    const token = await this.paymentHistoryService.createCardToken(dto);
    const data = {
      name: dto.name,
      cardNumber: dto.cardNumber,
      expMonth: dto.expMonth,
      expYear: dto.expYear,
      userId: dto.userId,
      brand: token.card.brand,
      cardToken: token.id
    }
    return this.UserCardServiceRepo.save(data)
  }

  getCardsByUser(userId: string) {
    return this.UserCardServiceRepo.find({
      where: { userId }
    })
  }

  async deleteCard(cardId: string) {
    const card = await this.UserCardServiceRepo.findOne({ where: { id: cardId } });
    if (!card) {
      return 'user card not found'
    }
    await this.UserCardServiceRepo.delete(card.id);
    return
  }

  getUserCard(cardId: string) {
    return this.UserCardServiceRepo.findOne({
      where: { id: cardId }
    })
  }

}