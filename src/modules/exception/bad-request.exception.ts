import {HttpStatus} from '@nestjs/common';
import {HttpException} from '@nestjs/core';

export class BadRequestException extends HttpException {
  constructor(error?: string) {
    super(error ? error : 'Bad Request', HttpStatus.BAD_REQUEST);
  }
}