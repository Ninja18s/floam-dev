import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudioModule } from '../studio/studio.module'
import { User } from '../users/user.entity'
import { CalendarController } from './calendar.controller'
import { CalendarEntity } from './calendar.entity'
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity]),
    forwardRef(() => StudioModule),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
