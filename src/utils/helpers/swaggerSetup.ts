import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Shop REST-API')
    .setDescription('Docs for shop rest api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
