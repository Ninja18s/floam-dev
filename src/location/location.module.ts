import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationController } from './location.controller'
import { Location } from './location.entity'
import { LocationService } from './location.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Location])
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
