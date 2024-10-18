import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MarketsService } from './markets.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggerService } from 'src/global/logger/logger.service';
import { Prisma, Role, User } from '@prisma/client';
import { PaginationMarketQueryDto } from './dto/paginate-markets.dto';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';

// to handle rate limiting
import { SkipThrottle } from '@nestjs/throttler';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';

@ApiTags('markets')
@UseGuards(RolesGuard)
@SkipThrottle()
@ApiBearerAuth()
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) { }
  private readonly logger = new LoggerService(MarketsController.name);

  @Post()
  @ApiOperation({ summary: 'create market' })
  @ApiResponse({
    status: 201,
    description: 'The markets has been successfully created.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT)
  create(
    @Body() createMarketDto: Prisma.MarketCreateInput,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.marketsService.create({
      createMarketDto,
      user_id: <string>user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Find all markets ' })
  @ApiResponse({
    status: 200,
    description: 'The markets has been successfully fetched.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT, Role.AUDITOR)
  findAll(
    @Query() query: PaginationMarketQueryDto, @CurrentUser() user: Partial<User>) {
    return this.marketsService.findAll(query, <string>user.company_id);
  }

  @Get(':market_id')
  @ApiOperation({ summary: 'find one market with its Id' })
  @ApiResponse({
    status: 200,
    description: 'The market has been successfully fetched.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT, Role.AUDITOR)
  findOne(@Param('market_id') market_id: string) {
    return this.marketsService.findOne(market_id);
  }

  @Patch(':market_id')
  @ApiOperation({ summary: 'update one market with its Market_id' })
  @ApiResponse({
    status: 200, // returned as this resource is again used in front end
    description: 'The market has been successfully updated.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @ApiOperation({ summary: 'update one market with its Market_id' })
  update(
    @Param('market_id') market_id: string,
    @Body() updateMarketDto: Prisma.MarketUpdateInput,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.marketsService.update({
      id: market_id,
      updateMarketDto,
      user_id: <string>user.id,
    });
  }

  @Delete(':market_id')
  @ApiOperation({ summary: 'delete one market with its Market_id' })
  @ApiResponse({
    status: 204, // returned as this resource is no more used in front end
    description: 'The market has been successfully deleted.',
  })
  @Roles(Role.ADG, Role.IT_SUPPORT)
  @ApiOperation({ summary: 'delete one market with its Market_id' })
  remove(@Param('market_id') market_id: string, @CurrentUser() user: Partial<User>,) {
    return this.marketsService.remove({ market_id, user_id: <string>user.id });
  }

  // // delete multiple markets
  // @Delete('delete-many')
  // async deleteMany(@Body() ids: string[], @CurrentUser() user: Partial<User>) {
  //   return this.marketsService.deleteManyByIds(ids, <string>user.id);
  // }

  // update multiple markets
}
