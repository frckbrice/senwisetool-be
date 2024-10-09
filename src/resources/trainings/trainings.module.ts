import { Module } from '@nestjs/common';
import { TrainingService } from './trainings.service';
import { TrainingController } from './trainings.controller';
import { UsersModule } from '../users/users.module';
// import { Slugify } from 'src/global/utils/slugilfy';

@Module({
  imports: [UsersModule],
  controllers: [TrainingController],
  providers: [
    TrainingService,
    //  Slugify
  ],
})
export class TrainingsModule { }
