import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy, keys, orderBy } from 'lodash';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './create.message.dto';
import { Message } from './message.entity';
const _ = require('underscore');

interface MessageMetaData {
     user: User;
     hasUnreadMessage: boolean;
     lastMessage: any,
     createdAt: Date
}

@Injectable()
export class MessageService {
     private log: Logger = new Logger('MessageService');

     constructor(
          @InjectRepository(Message)
          private readonly messageRepo: Repository<Message>
     ) {}

     createMessage(dto: CreateMessageDto) {
          const { senderId, receiverId, content } = dto;
          const message: Message = {
               content,
               senderId,
               receiverId,
               wasRead: false,
          };
          return this.messageRepo.save(message);
     }

     getMessagesBetweenUsers(senderId: string, receiverId: string) {
          return this.messageRepo.find({
               where: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
               ],
               order: { updatedAt: 'DESC' },
          });
     }

     async getMessagesForReceiver(receiverId: string) {
          const messages: Message[] = await this.messageRepo.find({
               order: { updatedAt: 'DESC' },
               where: [{ receiverId }, { senderId: receiverId }],
          });

          this.log.log('\n\n');
          const sortedMessages: Message[] = [];
          messages.forEach((message) => {
               const receiver: User = message.senderId === receiverId ? message.sender : message.receiver;
               const sender: User = message.senderId !== receiverId ? message.sender : message.receiver;
               if (sender.id !== receiverId)
                    sortedMessages.push({ ...message, sender,  receiver, senderId: sender.id, receiverId: receiver.id });
          });
          let senders: Map<string, Message> = groupBy(sortedMessages,'senderId');
          const senderKeys: string[] = keys(senders);
          const response: MessageMetaData[] = [];
          for (const key of senderKeys) {
               const hasUnreadMessage = senders[key].find((s) => !s.wasRead) !== undefined;
               const sender: User = senders[key][0].sender;
               const receiver: User = senders[key][0].receiver;
               const user = sender.id === receiverId ? receiver : sender;
               const lastMessage = senders[key][0].content;
               const createdAt = senders[key][0].createdAt;
               response.push({ user, hasUnreadMessage, lastMessage, createdAt });
          }

          const newlist = _.uniq(
               response,
               (singleResponse) => singleResponse.user.id
          );

          return newlist;
     }

     async markAsRead(messageId: string) {
          const message = await this.messageRepo.findOne(messageId);
          if (!message) {
               this.log.error(`message not found. id: ${messageId}`);
               throw new Error('Message Not found!');
          }
          message.wasRead = true;
          return this.messageRepo.save(message);
     }
}
