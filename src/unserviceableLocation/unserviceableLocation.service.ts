import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnserviceableLocation } from './unserviceableLocation.entity';

@Injectable()
export class UnserviceableLocationService {
     private log: Logger = new Logger('UnserviceableLocationService');

     constructor(
          @InjectRepository(UnserviceableLocation)
          private readonly unserviceableLocationRepository: Repository<
               UnserviceableLocation
          >
     ) {}

     async create(
          unserviceableLocation: UnserviceableLocation
     ): Promise<UnserviceableLocation> {
          this.log.debug(`Creating Unservicable Location `);
          return await this.unserviceableLocationRepository.save(
               unserviceableLocation
          );
     }

     async getAll(): Promise<UnserviceableLocation[]> {
          this.log.debug(`Get all Unservicable Location `);
          return await this.unserviceableLocationRepository.find();
     }
}
