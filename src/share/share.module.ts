import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';

@Module({
  controllers: [],
  providers: [
    // ShareService,
    ListenerService
  ],
})
export class ShareModule { }
