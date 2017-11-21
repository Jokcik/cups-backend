import {Module} from '@nestjs/common';
import {UploadsController} from './uploads.controller';
import {UploadsService} from './uploads.service';

@Module({
  controllers: [UploadsController],
  components: [UploadsService],
})
export class UploadsModule {

}