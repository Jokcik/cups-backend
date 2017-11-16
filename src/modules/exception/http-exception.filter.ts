import { HttpException } from '@nestjs/core';
import {ExceptionFilter} from '@nestjs/common/interfaces/exceptions';
import {Catch} from '@nestjs/common';
import {ExceptionsHandler} from '@nestjs/core/exceptions/exceptions-handler';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, response) {
    const status = 500;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}