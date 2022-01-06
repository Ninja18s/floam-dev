import { forwardRef, Logger, Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from '../entities/image.entity'
import { StudioModule } from '../studio/studio.module'
import { UserModule } from '../users/user.module'
import { ImageController } from './image.controller'
import { ImageService } from './image.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    MulterModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => StudioModule),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [],
})
export class ImageModule {}
