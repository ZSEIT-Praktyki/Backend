import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { swaggerSetup } from './utils/helpers/swaggerSetup';
import { rawOrdersMiddleware } from './orders/orders.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.use(rawOrdersMiddleware());

  swaggerSetup(app);
  await app.listen(3001);
}
bootstrap();
