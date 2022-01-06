export interface UploadedImageDto {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  ACL: string
  ETag: string
  Location: string
  key: string
  Key: string
  Bucket: string
  width: string
  height: string
  premultiplied: string
  size: string
  ContentType: string
}

/*
{
    "fieldname": "image",
    "originalname": "test_image.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "ACL": "public-read",
    "ETag": "\"459582fdd28fc6d9b73317d0224b163e\"",
    "Location": "https://floam-dev.s3.us-east-2.amazonaws.com//studio-images/test_image.jpg",
    "key": "/studio-images/test_image.jpg",
    "Key": "/studio-images/test_image.jpg",
    "Bucket": "floam-dev",
    "width": 1000,
    "height": 433,
    "premultiplied": false,
    "size": 25042,
    "ContentType": "jpeg"
}
 */
