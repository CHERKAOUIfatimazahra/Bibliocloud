import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { CategoryService } from '../categories/categories.service';
import { BookController } from './book.controller';
import { DynamoDBModule } from '../database/dynamodb.module';

@Module({
  providers: [BookService, CategoryService],
  controllers: [BookController],
  imports: [DynamoDBModule],
})
export class BookModule {}
