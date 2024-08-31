import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInterceptor } from './interceptors/user.interceptor';
import { Prisma, Role } from '@prisma/client';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('users') // enable api docs
@Controller('users')
@SkipThrottle() // avoid rate limit
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  // @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  // @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'create user' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() createUserDto: {
    user_id: string,
    user_email: string,
    first_name: string,
  }) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get all users' })
  @UseInterceptors(UserInterceptor)
  @ApiResponse({
    description: "successfully fetch all users",
    status: 200,
  })
  findAll(@Query() query: PaginationQueryDto) {
    const queryParams = {
      limit: Number(query.perPage || 30), // current default for pagination on admin dashboard
      skip: Number(query.page || 0),
      role: query?.role as Role | undefined
    }
    return this.usersService.findAll({ ...queryParams });
  }

  @Get(':id')
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get single user by id' })
  findOne(@Param('id') id: string, @Body() body: any) {
    return this.usersService.findOne(body.email);
  }

  @Patch(':id')
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  // TODO: to be update to right value
  @Throttle({ default: { ttl: 1000, limit: 5 } })
  @ApiOperation({ summary: 'patch a user by id' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'delete by id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
