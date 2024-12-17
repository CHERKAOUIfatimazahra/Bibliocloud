import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const getDynamoDBClient = () => {
  try {
    // Validate environment variables
    if (!process.env.AWS_ACCESS_KEY_ID) {
      throw new Error('AWS_ACCESS_KEY_ID is not defined');
    }
    if (!process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS_SECRET_ACCESS_KEY is not defined');
    }
    if (!process.env.AWS_REGION) {
      throw new Error('AWS_REGION is not defined');
    }

    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'eu-north-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    return DynamoDBDocumentClient.from(client);
  } catch (error) {
    console.error('DynamoDB Client Creation Error:', error);
    throw error;
  }
};
