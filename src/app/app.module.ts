import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Logger, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CalendarModule } from '../calendar/calendar.module';
import { CommunicationModule } from '../communication/communication.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { LocationModule } from '../location/location.module';
import { SeederModule } from '../seeder/seeder.module';
import { PaymentModule } from '../payment/payment.module';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../../ormconfig';
import { UserModule } from '../users/user.module';
import { StudioModule } from '../studio/studio.module';
import { ReviewModule } from '../review/review.module';
import { MessageModule } from '../message/message.module';
import { ImageModule } from '../images/image.module';
import { SupportModule } from '../support/support.module';
import { PaymentHistoryModule } from '../paymentHistory/paymentHistory.module';
import { UserCardModule } from '../userCard/userCard.module';
import { UnserviceableLocationModule } from '../unserviceableLocation/unserviceableLocation.module';
import { BankDetailModule } from '../bankDetail/bankDetail.module';
import { PayoutModule } from '../payout/payout.module';
import { UserBankDetailModule } from '../userBankDetails/userBankDetail.module';

@Module({
     imports: [
          ServeStaticModule.forRoot({
               rootPath: join(__dirname, '../..', 'public'),
          }),
          TypeOrmModule.forRoot(ormconfig),
          AuthModule,
          UserModule,
          StudioModule,
          ReviewModule,
          MessageModule,
          ImageModule,
          AppointmentModule,
          SeederModule,
          FavoriteModule,
          CommunicationModule,
          PaymentModule,
          LocationModule,
          CalendarModule,
          SupportModule,
          PaymentHistoryModule,
          UserCardModule,
          UnserviceableLocationModule,
          BankDetailModule,
          PayoutModule,
          UserBankDetailModule
     ],
     controllers: [AppController],
     providers: [AppService, AppGateway, Logger],
     exports: [AppGateway],
})
export class AppModule { }
