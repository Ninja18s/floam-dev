import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UnserviceableLocation } from './unserviceableLocation.entity';
import { UnserviceableLocationService } from './unserviceableLocation.service';

@Controller('unserviceableLocation')
export class UnserviceableLocationController {
     constructor(
          private readonly unserviceableLocationService: UnserviceableLocationService
     ) {}

     @Post('create')
     async create(@Body() unserviceableLocation: UnserviceableLocation) {
          if (!unserviceableLocation.city) {
               throw new Error('city is required');
          }
          if (!unserviceableLocation.state) {
               throw new Error('state is required');
          }
          if (!unserviceableLocation.zipCode) {
               throw new Error('zipCode is required');
          }
          const createdModel = await this.unserviceableLocationService.create(
               unserviceableLocation
          );
          return createdModel;
     }

     @Get('/')
     async getAll() {
          const foundModels = await this.unserviceableLocationService.getAll();
          return foundModels;
     }
}
