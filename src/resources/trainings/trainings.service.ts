import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, User } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { UsersService } from '../users/users.service';
import { Slugify } from 'src/global/utils/slugilfy';
import { PaginationTrainingQueryDto } from './dto/paginate-training.dto';

@Injectable()
export class TrainingService {
  private readonly logger = new LoggerService(TrainingService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private slugifyService: Slugify
  ) { }


  async create(createTrainingDto: Prisma.TrainingCreateInput, user: Partial<User>) {
    //TDOO: look if possible to avoid creating training twice

    console.log("from training service: ", createTrainingDto)
    try {
      const result = await this.prismaService.training.create({
        data: {
          ...createTrainingDto,
          slug: this.slugifyService.slugify(createTrainingDto.title),
        },
      });

      if (result)
        return {
          data: result,
          status: 201,
          message: `training created successfully`
        }
      else
        return {
          data: null,
          status: 500,
          message: `Failed to create training`
        }
    } catch (error) {

      if (error instanceof Prisma.PrismaClientValidationError) {
        this.logger.error(`Error while creating training ${error.name}: Validation error \n\n ${error}`, TrainingService.name);
        throw new InternalServerErrorException(`Validation Error while creating training ` + createTrainingDto.title);
      }
      this.logger.error(`Error while creating training ${createTrainingDto.title} \n\n ${error}`, TrainingService.name);
      throw new InternalServerErrorException(`Error while creating training ` + TrainingService.name);
    }
  }

  async findAll(query: Partial<PaginationTrainingQueryDto>) {

    // find all the training with the latest start date with its status and type
    const { page, perPage, locality } = query;
    let Query = Object.create({});
    Query = {
      ...Query,
      where: {
        ...(locality && { locality }),
      },
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        created_at: 'desc',
      }
    }
    // find all the companies
    try {
      const [total, trainings] = await this.prismaService.$transaction([
        this.prismaService.training.count(),
        this.prismaService.training.findMany(Query)
      ]);
      if (trainings.length)
        return {
          status: 200,
          message: "trainings fetched successfully",
          data: trainings,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20))
        }
      else
        return {
          status: 404,
          message: "No trainings found",
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20))
        }
    } catch (error) {
      this.logger.error(`Error fetching trainings \n\n ${error}`, TrainingService.name);
      throw new NotFoundException("Error fetching trainings");
    }
  }

  async findOne(training_id: string) {

    try {
      const result = await this.prismaService.training.findUnique({
        where: {
          id: training_id
        }
      })

      if (result)
        return {
          data: result,
          status: 200,
          message: `training fetched successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch training`
        }
    } catch (err) {
      this.logger.error(`Can't find a training with title: ${training_id} \n\n ${err}`, TrainingService.name);
      throw new NotFoundException("Can't find a training with id " + training_id);
    };
  }

  async update(id: string, updateTrainingDto: Prisma.TrainingUpdateInput) {

    try {
      const result = await this.prismaService.training.update({
        data: updateTrainingDto,
        where: {
          id
        }
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `training updated successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update training`
        }
    } catch (err) {
      this.logger.error(`Can't update a training with id ${id} \n\n ${err} `, TrainingService.name);
      throw new InternalServerErrorException("Can't update a training with id " + id);
    };
  }

  async remove(training_id: string) {
    try {
      const result = await this.prismaService.training.delete({
        where: {
          id: training_id
        }
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `training deleted successfully`
        }
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete training`
        }
    } catch (err) {
      this.logger.error(`Can't delete a training with training_id ${training_id} \n\n ${err}`, TrainingService.name);
      throw new InternalServerErrorException("Can't delete a training with training_id " + training_id);
    };
  }


}
