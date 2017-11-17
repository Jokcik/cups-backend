import {Component} from '@nestjs/common';
import {isUndefined} from 'util';

@Component()
export class GGUtils {
  public selectFieldByObject(obj: any, fields: string[]): any {
    let res = {};
    fields.forEach(field => {
      if (!isUndefined(obj[field])) {
        res[field] = obj[field]
      }
    });
    return res;
  }
}