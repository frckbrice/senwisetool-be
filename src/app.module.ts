import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './global/current-logged-in/request.service';
import { AuthMiddleware } from './global/middleware/auth.middleware';
import { RolesGuard } from './global/guards/auth.guard';
import { AllExceptionsFilter } from './global/filter/http-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { CompaniesModule } from './resources/companies/companies.module';
import { ProjectsModule } from './resources/projects/projects.module';
import { InspectionDataModule } from './resources/inspection_data/inspection_data.module';
import { MappingsModule } from './resources/mappings/mappings.module';
import { CampaignsModule } from './resources/campaigns/campaigns.module';
import { StockCampaignsModule } from './resources/stock_campaigns/stock_campaigns.module';
import { MarketsModule } from './resources/markets/markets.module';
import { ReceiptsModule } from './resources/receipts/receipts.module';
import { TransactionsModule } from './resources/transactions/transactions.module';
import { SubscriptionsModule } from './resources/subscriptions/subscriptions.module';
import { PricesModule } from './resources/prices/prices.module';
import { OffersModule } from './resources/offers/offers.module';
import { ChaptersModule } from './resources/chapters/chapters.module';
import { SharesModule } from './resources/shares/shares.module';
import { FarmersModule } from './resources/farmers/farmers.module';
import { FarmsModule } from './resources/farms/farms.module';
import { MyLoggerModule } from './global/logger/logger.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),
    CompaniesModule,
    ProjectsModule,
    InspectionDataModule,
    MappingsModule,
    CampaignsModule,
    StockCampaignsModule,
    MarketsModule,
    ReceiptsModule,
    TransactionsModule,
    SubscriptionsModule,
    PricesModule,
    OffersModule,
    ChaptersModule,
    SharesModule,
    FarmersModule,
    FarmsModule,
    MyLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, RequestService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,

    },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes({ path: "/", method: RequestMethod.GET });
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
