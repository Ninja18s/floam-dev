import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateCardDto } from './payment.objects'
import { PaymentService } from './payment.service'

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  private log: Logger = new Logger('PaymentController')

  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Get('/cards/users/:userId')
  getCardsInfoForUser(@Param('userId') userId: string) {
    this.log.log(`[GET][getCardsInfoForUser]`)
    return this.paymentService.getCards(userId)
  }

  @Post('/cards')
  registerCardInfo(@Body() data: CreateCardDto) {
    this.log.log(`[POST][registerCardInfo]`)
    return this.paymentService.registerCard(data)
  }

  @Delete('/cards/users/:userId')
  async removeCardInfo(
    @Param('userId') userId: string,
    @Body('cardId') cardId: string,
  ) {
    this.log.log(`[DELETE][removeCardInfo]`)
    await this.paymentService.deleteCard(userId, cardId)
    return 'Card Deleted.'
  }
}
