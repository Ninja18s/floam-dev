import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../users/user.module'
import { UserCard } from './userCard.entity'
import { UserCardController } from './userCard.controller'
import { UserCardService } from './userCard.service';
import { PaymentHistoryModule } from '../paymentHistory/paymentHistory.module'

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => PaymentHistoryModule),
        TypeOrmModule.forFeature([UserCard]),
    ],
    providers: [UserCardService],
    controllers: [UserCardController],
    exports: [UserCardService],
})
export class UserCardModule { }
