import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryService } from './categories.service';
import { DynamoDBModule } from '../database/dynamodb.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoryService],
  imports: [DynamoDBModule],
})
export class CategoriesModule {}
