import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { ProjectAssigneeModule } from '../project-assignee/project-assignee.module';

@Module({
  imports: [ProjectAssigneeModule],
  controllers: [MarketsController],
  providers: [MarketsService],
})
export class MarketsModule { }
