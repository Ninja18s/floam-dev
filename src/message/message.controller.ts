import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { CommunicationService } from '../communication/communication.service'
import { User } from '../users/user.entity'
import { Message } from './message.entity'
import { CreateMessageDto } from './create.message.dto'
import { MessageService } from './message.service'
import { UserNotificationService } from '../userNotification/userNotification.service'
import { UserService } from '../users/user.service'

interface MessageMetaData {
  user: User
  hasUnreadMessage: boolean
}

@Controller('messages')
export class MessageController {
  private log: Logger = new Logger('MessageController')

  constructor(
    private readonly messageService: MessageService,
    private readonly commsService: CommunicationService,
    private UserNotificationService: UserNotificationService,
    private userService: UserService,
  ) {}

  @Get('/sender/:senderId/receiver/:receiverId')
  async getMessagesBetweenUsers(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    const messages = await this.messageService.getMessagesBetweenUsers(senderId, receiverId)

    this.log.debug('messages: ')
    this.log.debug(messages)
    return messages
  }

  @Get('/users/:userId')
  async getMessagesSentToUser(
    @Param('userId') userId: string,
  ): Promise<MessageMetaData[]> {
    return this.messageService.getMessagesForReceiver(userId)
  }

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    const senderUser = await this.userService.getUser(createMessageDto.senderId);
    const receiverUser = await this.userService.getUser(createMessageDto.receiverId);
    const text = ` You have recieved a new message from ${senderUser.firstName} ${senderUser.lastName}`
    // await this.UserNotificationService.createNotification(text, receiverUser.id, 'messageCreate',senderUser.id);
    const message = await this.messageService.createMessage(createMessageDto)
    const { receiverId } = createMessageDto
    // this.commsService.notifyDevice(receiverId)
    return message
  }

  @Post('/:messageId/mark')
  async markMessageAsRead(@Param('messageId') messageId: string) {
    return this.messageService.markAsRead(messageId)
  }
}
