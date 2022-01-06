import { Body, Controller, Get, Logger, Param, Post, Delete } from '@nestjs/common'
import { UserCardService } from './userCard.service'
import { userCardDto } from './userCard.dto'
import { UserService } from '../users/user.service'
import { UserCard } from './userCard.entity'

@Controller('userCards')
export class UserCardController {
  private log: Logger = new Logger('UserCardController')

  constructor(
    private readonly userCardService: UserCardService,
    private userService: UserService,
  ) { }

  @Post()
  async createUserCard(@Body() userCardDto: userCardDto): Promise<UserCard> {
    await this.userService.getUser(userCardDto.userId);
    const userCard = await this.userCardService.createCard(userCardDto);
    return userCard
  }

  @Get('/users/:userId')
  async getUserCards(@Param('userId') userId: string) {
    this.log.log('[GET] Card which belong to user');
    await this.userService.getUser(userId);
    const userCards = await this.userCardService.getCardsByUser(userId);
    return (userCards.reverse())
  }

  @Delete('/:id')
  async removeCardInfo(
    @Param('id') id: string,
  ) {
    this.log.log(`[DELETE][removeCardInfo]`)
    await this.userCardService.deleteCard(id)
    return 'Card Deleted.'
  }

}