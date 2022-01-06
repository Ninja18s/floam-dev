import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import { Image, IMAGE_TYPE } from '../entities/image.entity';
import { Studio } from '../studio/studio.entity';
import { StudioService } from '../studio/studio.service';
import { User } from '../users/user.entity';
import { UserService } from '../users/user.service';
import { UFile } from '../utils/globalTypes';
import S3Client from '../utils/s3Client';

@Injectable()
export class ImageService {
     private log: Logger = new Logger('ImageService');
     private s3Client: S3Client = new S3Client();

     constructor(
          @InjectRepository(Image)
          private readonly imageRepo: Repository<Image>,
          private readonly studioService: StudioService,
          private readonly userService: UserService
     ) {}

     // todo: @ade add global exception handler
     async uploadImage(image: UFile, type: IMAGE_TYPE, identifier: string) {
          const [key, id] = identifier.split(':');
          this.log.log(`[uploadImage] identifier: ${identifier}`);
          if (!key || !id) {
               this.log.error(`Invalid identifier: ${identifier}`);
               throw new HttpException(
                    'Invalid identifier',
                    HttpStatus.BAD_REQUEST
               );
          }

          // validate id
          let studio: Studio = null;
          let user: User = null;
          if (key === 'studio') {
               studio = await this.studioService.getStudio(id);
          }

          if (key === 'user') {
               user = await this.userService.getUser(id);
          }

          // process upload
          let imageSrc = null;
          if (type === IMAGE_TYPE.GID) {
               imageSrc = await this.s3Client.uploadGovernmentId(image, id);
          } else if (type === IMAGE_TYPE.STUDIO) {
               imageSrc = await this.s3Client.uploadStudioPicture(image, id);
          } else if (type === IMAGE_TYPE.PROFILE) {
               imageSrc = await this.s3Client.uploadProfilePicture(image, id);
          } else if (type === IMAGE_TYPE.DOCLINK) {
               imageSrc = await this.s3Client.uploadDocLink(image, id);
          }

          if (!imageSrc) {
               throw new HttpException(
                    'Invalid Image Type',
                    HttpStatus.BAD_REQUEST
               );
          }

          const newImage = {
               src: imageSrc,
               type,
               studioId: studio?.id || null,
               userId: user?.id || null,
          };

          this.log.log(`[ImageController] .................. End`);
          return await this.imageRepo.save(newImage);
     }

     async uploadDocWithoutId(image: UFile) {
          // process upload
          let imageSrc = null;
          imageSrc = await this.s3Client.uploadDocWithoutId(image);
          if (!imageSrc) {
               throw new HttpException(
                    'Invalid Image Type',
                    HttpStatus.BAD_REQUEST
               );
          }
          return imageSrc;
     }

     async getStudioImages(studioId: string) {
          const studio = await this.studioService.getStudio(studioId);
          return this.imageRepo.find({
               where: { studio },
          });
     }

     async deleteImages(imageIds) {
          if (imageIds && imageIds.length){
               for (var id of imageIds){
                    await this.imageRepo.delete(id);
               }
          }
          return 
          
     }

     async getUserProfileImage(userId: string, type) {
          if (type) {
               const user = await this.userService.getUser(userId);
               return this.imageRepo.findOne({
                    where: { user, type: type },
               });
          } else {
               const user = await this.userService.getUser(userId);
               return this.imageRepo.findOne({
                    where: { user, type: IMAGE_TYPE.PROFILE },
               });
          }
     }
}
