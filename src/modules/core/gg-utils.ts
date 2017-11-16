import {Component} from '@nestjs/common';

@Component()
export class GGUtils {
  public selectFieldByObject(obj: any, fields: string[]): any {
    return fields.map(field => obj[field]);
  }
}