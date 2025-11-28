import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const createS3Client = (configService: ConfigService) => {
  const accessKeyId = configService.get<string>('S3_ACCESS_KEY');
  const secretAccessKey = configService.get<string>('S3_SECRET_KEY');
  const region = configService.get<string>('S3_REGION');
  const endpoint = configService.get<string>('S3_ENDPOINT');

  if (!accessKeyId || !secretAccessKey || !region || !endpoint) {
    throw new Error('S3 credentials or configuration missing!');
  }

  const credentials = {
    accessKeyId,
    secretAccessKey,
  };

  return new S3Client({
    region,
    endpoint,
    credentials,
  });
};
