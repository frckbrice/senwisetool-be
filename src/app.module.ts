import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './global/request.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/auth.guard';
import { AllExceptionsFilter } from './filter/http-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 3,
    }]),
  ],
  controllers: [AppController],
  providers: [AppService, RequestService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,

    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
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
