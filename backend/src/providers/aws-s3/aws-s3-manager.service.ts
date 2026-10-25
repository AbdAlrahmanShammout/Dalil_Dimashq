import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import { AwsS3ConfigService } from '@/config/aws-s3/aws-s3-config.service';
import { UploadObjectInput, UploadObjectResult } from '@/providers/aws-s3/defs/upload-object.defs';
import { AwsS3NotConfiguredException } from '@/providers/aws-s3/exceptions/aws-s3-not-configured.exception';

@Injectable()
export class AwsS3ManagerService {
  private client: S3Client | undefined;

  constructor(private readonly awsS3ConfigService: AwsS3ConfigService) {}

  /**
   * Stores bytes the API already received and returns a short-lived read URL.
   * This never issues a presigned upload.
   */
  async uploadObject(input: UploadObjectInput): Promise<UploadObjectResult> {
    if (!this.awsS3ConfigService.isConfigured) {
      throw new AwsS3NotConfiguredException();
    }
    const bucket = this.awsS3ConfigService.bucket;
    await this.getClient().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: input.key,
        Body: input.body,
        ContentType: input.contentType,
      }),
    );
    const readUrl = await this.createReadUrl(input.key);
    return { key: input.key, readUrl };
  }

  /**
   * Short-lived read URL for an object key. Never a presigned upload.
   */
  async createReadUrl(key: string): Promise<string> {
    if (!this.awsS3ConfigService.isConfigured) {
      throw new AwsS3NotConfiguredException();
    }
    const bucket = this.awsS3ConfigService.bucket;
    return getSignedUrl(this.getClient(), new GetObjectCommand({ Bucket: bucket, Key: key }), {
      expiresIn: this.awsS3ConfigService.readTtlSeconds,
    });
  }

  private getClient(): S3Client {
    if (!this.client) {
      this.client = new S3Client({
        region: this.awsS3ConfigService.region,
        credentials: {
          accessKeyId: this.awsS3ConfigService.accessKeyId,
          secretAccessKey: this.awsS3ConfigService.secretAccessKey,
        },
      });
    }
    return this.client;
  }
}
