import {
     Controller,
     Get,
     Logger,
     Param,
     Post,
     UploadedFile,
     UseInterceptors,
     Query,
     Put,
     Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image, IMAGE_TYPE } from '../entities/image.entity';
import { UFile } from '../utils/globalTypes';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
     private log: Logger = new Logger('ImageController');

     constructor(private readonly imageService: ImageService) {}

     @Get('/studios/:studioId')
     getStudioImages(@Param('studioId') studioId: string): Promise<Image[]> {
          this.log.log('[GET] studio images');
          return this.imageService.getStudioImages(studioId);
     }

     @Get('/users/:userId/profile')
     getUserProfileImage(
          @Param('userId') userId: string,
          @Query('type') type: string
     ): Promise<Image> {
          this.log.log('[GET] user profile image');
          return this.imageService.getUserProfileImage(userId, type);
     }

     @Post('upload/:identifier/:type')
     @UseInterceptors(FileInterceptor('image'))
     async uploadFile(
          @UploadedFile() image: UFile,
          @Param('identifier') identifier: string,
          @Param('type') type: IMAGE_TYPE
     ) {
          return this.imageService.uploadImage(image, type, identifier);
     }

     @Post('upload/doc')
     @UseInterceptors(FileInterceptor('image'))
     async uploadFileWithoutId(@UploadedFile() image: UFile) {
          return await this.imageService.uploadDocWithoutId(image);
     }

     @Put('/delete')
     async deleteStudioImages(@Body('imageIds') imageIds: [string]) {
       this.log.log(`[DELETE][removeImage]`)
       await this.imageService.deleteImages(imageIds)
       return 'Image Deleted.'
     }
}

