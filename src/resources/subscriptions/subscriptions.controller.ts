import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { Prisma, Role, User } from '@prisma/client';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) { }

  @Post()
  @ApiOperation({ summary: 'Subscribe to a product plan' })
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return await this.subscriptionsService.subscribeToPlanService(createSubscriptionDto);
  }

  @Get()
  async findAll() {
    return this.subscriptionsService.findAll();
  }

  // TODO: add gards all over here where it's necessary
  @Get(':company_id/company')
  // @UseGuards(RolesGuard)
  // @Roles(Role.ADG, Role.PDG, Role.IT_SUPPORT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get company subscription' })
  @ApiResponse({ status: 200, description: 'this is the company subscription' })
  async getCompanySubsription(@Param('company_id') company_id: string) {
    return this.subscriptionsService.getCompanySubscription(company_id);
  }

  // unSBubscribe a company
  @Patch(':subscription_id/company_id/company')
  @ApiOperation({ summary: 'Unsubscribe company from subscription' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'unsubscription done' })
  async unsubscribeCompany(@Param() params: string[], @Body() body: any) {
    return this.subscriptionsService.unsubscribeCompany({ subscription_id: params[0], company_id: params[1] });
  }

  // upgrade plqn
  @Patch(':subscription_id/revise')
  upgradeSubscriptionPlan(@Param('subscription_id') subscription_id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.upgradeSubscriptionPlan(subscription_id, updateSubscriptionDto);
  }

  @Delete(':subscription_id')
  remove(@Param('subscription_id') subscription_id: string) {
    return this.subscriptionsService.remove(subscription_id);
  }

  @Get('cancelPayPalPayment')
  @ApiOperation({ summary: 'sucessfully cancel subscription from paypal' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  async cancelPayPalPayment(@Body() subscriptionPayload: any) {
    return this.subscriptionsService.cancelPayPalPayment(subscriptionPayload);
  }

  @Get('successPayPalPayment')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.' })
  @ApiOperation({ summary: 'successful subscription from paypal event' })
  successPayPalPayment(@Query() subscription_id: string, @CurrentUser() user: Partial<User>) {
    return this.subscriptionsService.successPayPalPayment(subscription_id, <string>user?.company_id);
  }

  // get subscription details
  @Get(':subscription_id')
  @ApiResponse({ status: 200, description: 'Successfully fetch subscription details' })
  @ApiOperation({ summary: 'Get subscription details' })
  async getSubscriptionDetails(@Param('subscription_id') subscription_id: string, @CurrentUser() user: User) {
    return this.subscriptionsService.getSubscriptionDetails(subscription_id, user.company_id);
  }
}
