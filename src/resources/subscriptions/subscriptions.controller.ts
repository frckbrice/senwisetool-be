import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  @ApiOperation({ summary: 'Subscribe to a product plan' })
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.subscribe(createSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  // TODO: add gards all over here where it's necessary
  @Get(':company_id/company')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get company subscription' })
  @ApiResponse({ status: 200, description: 'this is the company subscription' })
  getCompanySubsription(@Param('company_id') company_id: string) {
    return this.subscriptionsService.getCompanySubscription(company_id);
  }

  @Patch(':subscription_id/company_id/company')
  @ApiOperation({ summary: 'Unsubscribe company from subscription' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'unsubscription done' })
  unsubscribeCompany(@Param() params: string[], @Body() body: any) {
    return this.subscriptionsService.unsubscribeCompany({ subscription_id: params[0], company_id: params[1] });
  }

  @Patch(':id/revise')
  upgradeSubscriptionPlan(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.upgradeSubscriptionPlan(id, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  }

  @Get('cancelPayPalPayment')
  @ApiOperation({ summary: 'sucessfully cancel subscription from paypal' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  cancelPayPalPayment(@Body() subscriptionPayload: any) {
    return this.subscriptionsService.cancelPayPalPayment(subscriptionPayload);
  }

  @Get('successPayPalPayment')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  @ApiOperation({ summary: 'successful subscription from paypal event' })
  successPayPalPayment(@Body() subscriptionPayload: any) {
    return this.subscriptionsService.successPayPalPayment(subscriptionPayload);
  }
}
