import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnserviceableLocationController } from './unserviceableLocation.controller';
import { UnserviceableLocation } from './unserviceableLocation.entity';
import { UnserviceableLocationService } from './unserviceableLocation.service';

@Module({
     imports: [TypeOrmModule.forFeature([UnserviceableLocation])],
     controllers: [UnserviceableLocationController],
     providers: [UnserviceableLocationService],
     exports: [UnserviceableLocationService],
})
export class UnserviceableLocationModule {}
