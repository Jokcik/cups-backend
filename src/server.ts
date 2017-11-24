import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
import {HttpExceptionFilter} from './modules/exception/http-exception.filter';
import * as cors from 'express-cors';
import * as express from 'express'
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(bodyParser.json());
  app.setGlobalPrefix('api');
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors({allowedOrigins: ['localhost:3000'], headers: ['enctype']}));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3001);
}
bootstrap();
