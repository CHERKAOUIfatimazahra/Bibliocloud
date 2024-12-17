import { Module, Global, OnModuleInit } from '@nestjs/common';
import { DynamoDBService } from './dynamodb.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DynamoDBService],
  exports: [DynamoDBService],
})
export class DynamoDBModule implements OnModuleInit {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async onModuleInit() {
    // Ensure tables are created before the application starts
    await this.dynamoDBService.onModuleInit();
  }
}
