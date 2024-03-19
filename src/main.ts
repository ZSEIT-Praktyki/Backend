import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { swaggerSetup } from './utils/helpers/swaggerSetup';
import { rawOrdersMiddleware } from './orders/orders.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://192.168.0.25:3000', 'http://localhost:3000'],
    credentials: true,
  });
  app.use(cookieParser('secret'));
  app.useGlobalPipes(new ValidationPipe());
  app.use(rawOrdersMiddleware());

  swaggerSetup(app);
  await app.listen(3001, '192.168.0.25');
}
bootstrap();
