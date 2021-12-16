import { APIGatewayEvent } from 'aws-lambda';

import { dynamodb } from './config/dynamodb.config';

type HttpResponse = {
  statusCode: number;
  body?: string;
};

export async function handler(_event: APIGatewayEvent): Promise<HttpResponse> {
  try {
    const dynamodbResponse = await dynamodb
      .update({
        Key: {
          PK: '1',
        },
        TableName: 'orders',
        UpdateExpression: 'set orders = orders + :incrementValue',
        ExpressionAttributeValues: {
          ':incrementValue': 1,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    const { orders } = dynamodbResponse.Attributes;

    return {
      statusCode: 200,
      body: JSON.stringify({ orders }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify('Internal server error'),
    };
  }
}
