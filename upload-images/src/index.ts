import { APIGatewayEvent } from 'aws-lambda';

import { s3 } from './configs/s3.config';

type HttpResponse = {
  statusCode: number;
  body?: string;
};

export async function handler(event: APIGatewayEvent): Promise<HttpResponse> {
  try {
    const { imageUrl } = JSON.parse(event.body);

    await s3.upload(imageUrl);

    return {
      statusCode: 204,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
    };
  }
}
