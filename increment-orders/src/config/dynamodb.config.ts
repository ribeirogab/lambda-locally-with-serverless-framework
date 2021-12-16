import { DynamoDB as AwsDynamoDB } from 'aws-sdk';

import { env } from './env.config';

export interface DynamodbInterface {
  client: AwsDynamoDB.DocumentClient;
}

class DynamoDB implements DynamodbInterface {
  public client: AwsDynamoDB.DocumentClient;

  constructor() {
    const config =
      env.NODE_ENV === 'production'
        ? {
            /* production config */
          }
        : {
            region: 'localhost',
            endpoint: 'http://localhost:8000',
            accessKeyId: 'DEFAULT_ACCESS_KEY',
            secretAccessKey: 'DEFAULT_SECRET',
          };

    this.client = new AwsDynamoDB.DocumentClient(config);
  }
}

export const dynamodb = new DynamoDB().client;
