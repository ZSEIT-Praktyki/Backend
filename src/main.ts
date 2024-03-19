import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { swaggerSetup } from './utils/helpers/swaggerSetup';
import { rawOrdersMiddleware } from './orders/orders.middleware';

const origin =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://192.168.0.0.25:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: origin,
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe());
  app.use(rawOrdersMiddleware());

  swaggerSetup(app);
  await app.listen(3001);
}
bootstrap();
