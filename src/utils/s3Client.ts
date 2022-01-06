import * as AWS from 'aws-sdk';
import { ManagedUpload, PutObjectRequest } from 'aws-sdk/clients/s3';
import { UFile } from './globalTypes';

const { ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;
console.log(ACCESS_KEY_ID, SECRET_ACCESS_KEY);
const BUCKET_NAME = 'floam-images-dev';

export default class S3Client {
     private client: AWS.S3;

     constructor() {
          this.client = new AWS.S3({
               apiVersion: '2006-03-01',
               secretAccessKey: SECRET_ACCESS_KEY,
               accessKeyId: ACCESS_KEY_ID,
          });
     }

     uploadStudioPicture(file: UFile, studioId: string) {
          const hash = S3Client.randomHash();
          return this.uploadToS3(
               file,
               `profile-picture/studio:${studioId}/${hash}`
          );
     }

     uploadProfilePicture(file: UFile, userId: string) {
          const hash = S3Client.randomHash();
          return this.uploadToS3(
               file,
               `profile-picture/user:${userId}/${hash}`
          );
     }

     uploadDocWithoutId(file: UFile) {
          const hash = S3Client.randomHash();
          return this.uploadToS3(file, `doc-link/${hash}`);
     }

     uploadGovernmentId(file: UFile, userId: string) {
          const hash = S3Client.randomHash();
          return this.uploadToS3(file, `government-id/user:${userId}/${hash}`);
     }

     uploadDocLink(file: UFile, userId: string) {
          const hash = S3Client.randomHash();
          return this.uploadToS3(file, `doc-link/user:${userId}/${hash}`);
     }

     private async uploadToS3(file: UFile, key?: string): Promise<string> {
          console.log(file.originalname);
          const params: PutObjectRequest = {
               Bucket: BUCKET_NAME,
               Key: key || `sample-app/${file.originalname}`,
               Body: file.buffer,
               ACL: 'public-read',
          };

          const response: ManagedUpload.SendData = await this.client
               .upload(params)
               .promise();
          console.log(response);
          return response.Location;
     }

     private static randomHash() {
          return (
               Math.random().toString(36).substring(2, 5) +
               Math.random().toString(36).substring(2, 5)
          );
     }
}
