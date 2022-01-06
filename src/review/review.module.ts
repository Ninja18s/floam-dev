import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppointmentModule } from '../appointment/appointment.module'
import { StudioModule } from '../studio/studio.module'
import { UserModule } from '../users/user.module'
import { Review } from './review.entity'
import { ReviewController } from './review.controller'
import { ReviewService } from './review.service'

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => StudioModule),
    forwardRef(() => AppointmentModule),
    TypeOrmModule.forFeature([Review]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [TypeOrmModule, ReviewService],
})
export class ReviewModule {}
