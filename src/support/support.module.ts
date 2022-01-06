import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommunicationModule } from '../communication/communication.module'
import { UserModule } from '../users/user.module'
import { Support } from './support.entity'
import { SupportController } from './support.controller'
import { supportService } from './support.service';
import { StudioModule } from '../studio/studio.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Support]),
    forwardRef(() => UserModule),
    forwardRef(() => StudioModule)
  ],
  providers: [supportService],
  controllers: [SupportController],
  exports: [supportService],
})
export class SupportModule {}
