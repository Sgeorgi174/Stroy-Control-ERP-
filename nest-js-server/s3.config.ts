export const s3Config = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  bucket: process.env.S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT, // например https://s3.timeweb.com
};
