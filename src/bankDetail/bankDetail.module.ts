import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { BankDetail } from './bankDetail.entity';
import { BankDetailController } from './bankDetail.controller';
import { BankDetailService } from './bankDetail.service';

@Module({
     imports: [
          forwardRef(() => UserModule),
          TypeOrmModule.forFeature([BankDetail]),
     ],
     providers: [BankDetailService],
     controllers: [BankDetailController],
     exports: [BankDetailService],
})
export class BankDetailModule {}
