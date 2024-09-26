import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma, Role, User } from '@prisma/client';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';

@ApiTags('price_plans')
@ApiBearerAuth('access-token')
@Controller('price_plans')
export class PricesController {
  constructor(private readonly pricesService: PricesService) { }

  @Post()
  @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create price plan' })
  @ApiResponse({
    status: 201,
    type: CreatePriceDto,
    description: 'Created price plan',
  })
  async create(@Body() createPriceDto: Prisma.Price_planCreateInput) {
    return await this.pricesService.create(createPriceDto);
  }

  @Get()
  async findAll() {
    return await this.pricesService.findAll();
  }

  @Get(':plan_name')
  @ApiOperation({ summary: 'get a price plan' })
  @ApiResponse({
    status: 200,
    type: CreatePriceDto,
    schema: Prisma.Price_planScalarFieldEnum,
    content: {},
    description: 'successfully fetch a plan',
  })
  async findOne(@Param('plan_name') plan_name: string) {
    console.log('findOne: ', plan_name);
    return await this.pricesService.findOne(plan_name);
  }

  @Get('current')
  @ApiOperation({ summary: 'get current price plan' })
  @ApiResponse({
    status: 200,
    type: CreatePriceDto,
    schema: Prisma.Price_planScalarFieldEnum,
    content: {},
    description: 'successfully fetch a plan',
  })
  async findCompanyCurrentPlan(@CurrentUser() user: Partial<User>) {
    return this.pricesService.findCurrentcompanyPlan(<string>user.company_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    return this.pricesService.update(+id, updatePriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricesService.remove(+id);
  }
}
