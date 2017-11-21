import {Component, Request} from '@nestjs/common';
import {BadRequestException} from '../exception/bad-request.exception';
import {TYPES} from './uploads.constants';
import {promisify} from 'bluebird';
import * as uniqid from 'uniqid'
import * as path from 'path';
import * as formidable from 'formidable';
import * as fs from 'fs';
import * as _ from 'lodash'

const form = new formidable.IncomingForm();
const parse = promisify(form.parse, {multiArgs: true, context: form});

@Component()
export class UploadsService {
  public async uploadFile(@Request() req) {
    let [fields, files]: any = await parse(req);
    if (!_.includes(TYPES, fields.type)) throw new BadRequestException('invalid type');

    let url = '/images/' + fields.type + '/' + uniqid() + path.extname(files.logo.name);
    fs.renameSync(files.logo.path, './src' + url);
    return {status: 201, url: req.get('host') + url}
  }
}