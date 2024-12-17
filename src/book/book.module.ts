import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DynamoDBModule } from '../database/dynamodb.module';

@Module({
  providers: [BookService],
  controllers: [BookController],
  imports: [DynamoDBModule],
})
export class BookModule {}
