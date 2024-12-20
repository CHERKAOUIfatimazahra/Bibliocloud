import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDBService } from './database/dynamodb.service';
import { BookModule } from './book/book.module';
import { CategoriesModule } from './categories/categories.module';
import { EmpruntsController } from './emprunts/emprunts.controller';
import { EmpruntsModule } from './emprunts/emprunts.module';

@Module({
  imports: [
    BookModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CategoriesModule,
    EmpruntsModule,
  ],
  controllers: [AppController, EmpruntsController],
  providers: [AppService, DynamoDBService],
})
export class AppModule {}
