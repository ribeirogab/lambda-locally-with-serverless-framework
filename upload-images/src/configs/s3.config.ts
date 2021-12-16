import { S3, Endpoint } from 'aws-sdk';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

import { env } from './env.config';

class SimpleStorageService {
  private s3Client: S3;

  constructor() {
    const config =
      env.NODE_ENV === 'production'
        ? {
            /* production config */
          }
        : {
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: new Endpoint('http://localhost:4569'),
          };

    this.s3Client = new S3(config);
  }

  public async upload(imageUrl: string): Promise<void> {
    const { data } = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(data, 'base64');
    const filename = `${Date.now()}.jpeg`;
    const bucketName = 'tech-talks-bucket';

    await this.s3Client
      .putObject({
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      })
      .promise();

    if (env.NODE_ENV === 'development') {
      // await this.sanitizeS3LocalUpload({ filename, bucketName });
    }
  }

  private async sanitizeS3LocalUpload({
    filename,
    bucketName,
  }: {
    filename: string;
    bucketName: string;
  }) {
    const localBucketDir = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'buckets',
      bucketName,
    );

    const s3LocalNameSuffix = '._S3rver_object';
    const deleteFilesWithSuffixes = [
      '._S3rver_metadata.json',
      '._S3rver_object.md5',
    ];

    const oldFilename = `${localBucketDir}/${filename}${s3LocalNameSuffix}`;
    const newFIlename = oldFilename.replace(s3LocalNameSuffix, '');

    const deleteUnusedFilesPromises = deleteFilesWithSuffixes.map(suffix =>
      fs.promises.unlink(`${localBucketDir}/${filename}${suffix}`),
    );

    await fs.promises.rename(oldFilename, newFIlename);
    await Promise.all(deleteUnusedFilesPromises);
  }
}

export const s3 = new SimpleStorageService();
