import { AwsS3ConfigService } from '@/config/aws-s3/aws-s3-config.service';
import { AwsS3ManagerService } from '@/providers/aws-s3/aws-s3-manager.service';
import { AwsS3NotConfiguredException } from '@/providers/aws-s3/exceptions/aws-s3-not-configured.exception';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: jest.fn().mockResolvedValue({}) })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://cdn.example/read'),
}));

describe('AwsS3ManagerService', () => {
  it('refuses to upload when the bucket is unset', async () => {
    const config = { isConfigured: false } as AwsS3ConfigService;
    const service = new AwsS3ManagerService(config);
    await expect(
      service.uploadObject({ key: 'a.jpg', body: Buffer.from('a'), contentType: 'image/jpeg' }),
    ).rejects.toBeInstanceOf(AwsS3NotConfiguredException);
  });

  it('uploads bytes and returns a read url', async () => {
    const config = {
      isConfigured: true,
      bucket: 'dalil',
      region: 'eu-central-1',
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      readTtlSeconds: 900,
    } as AwsS3ConfigService;
    const service = new AwsS3ManagerService(config);
    const actual = await service.uploadObject({
      key: 'photos/a.jpg',
      body: Buffer.from('a'),
      contentType: 'image/jpeg',
    });
    expect(actual).toEqual({ key: 'photos/a.jpg', readUrl: 'https://cdn.example/read' });
  });
});
