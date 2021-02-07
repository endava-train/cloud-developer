import * as AWS from 'aws-sdk';

export interface ImagesBucket {
  getUploadUrl(todoId: string): string;
}

class ImagesBucketImp implements ImagesBucket {
  constructor(
    private readonly s3Client: AWS.S3 = new AWS.S3({signatureVersion: 'v4'}),
    private readonly bucketName: string = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration: number = Number(process.env.SIGNED_URL_EXPIRATION)) {
  }

  private readonly _operation: string = 'putObject';

  getUploadUrl(todoId: string): string {
    return this.s3Client.getSignedUrl(this._operation, {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration,
    });
  }

}

const imagesBucket: ImagesBucket = new ImagesBucketImp();
export default imagesBucket;

