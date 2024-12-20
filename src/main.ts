import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
