import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInterceptor } from './interceptors/user.interceptor';
import { Role } from '@prisma/client';
import { Roles } from 'src/guards/roles.decorator';
import { RolesGuard } from 'src/guards/auth.guard';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('users') // enable api docs
@Controller('users')
@SkipThrottle() // avoid rate limit
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'create user' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get all users' })
  @UseInterceptors(UserInterceptor)
  findAll(@Query() query: PaginationQueryDto) {
    const queryParams = {
      limit: Number(query.limit || 30), // current default for pagination on admin dashboard
      skip: Number(query.skip || 0),
    }
    return this.usersService.findAll(queryParams);
  }

  @Get(':id')
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'get single user by id' })
  findOne(@Param('id') id: string, @Body() body: any) {
    const email = body.email;
    return this.usersService.findOne(email);
  }

  @Patch(':id')
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'patch a user by id' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // @Delete(':id')
  // @Roles(Role.ADG, Role.IT_SUPPORT)
  // @UseGuards(RolesGuard)
  // @ApiOperation({ summary: 'delete by id' })
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
