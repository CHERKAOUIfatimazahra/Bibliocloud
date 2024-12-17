import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDBService } from './database/dynamodb.service';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    BookModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DynamoDBService],
})
export class AppModule {}
