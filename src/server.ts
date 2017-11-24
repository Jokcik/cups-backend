import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';
import {HttpExceptionFilter} from './modules/exception/http-exception.filter';
import * as cors from 'express-cors';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(bodyParser.json());
  app.setGlobalPrefix('api');
  app.use(cors({allowedOrigins: ['localhost:3000']}));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3001);
}
bootstrap();
