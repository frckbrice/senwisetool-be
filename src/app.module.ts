import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RolesGuard } from './guards/auth.guard';
import { AllExceptionsFilter } from './filter/http-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RequestService, {
    provide: APP_GUARD,
    useClass: RolesGuard
  }, {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes({ path: "/", method: RequestMethod.GET });
    consumer.apply(AuthMiddleware).forRoutes("*");
  }
}
