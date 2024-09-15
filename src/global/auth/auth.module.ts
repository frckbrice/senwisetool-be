import { Module } from '@nestjs/common';
import { UsersModule } from 'src/resources/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { CurrentPlanIds } from '../utils/current-plan-ids';
import { UsersService } from 'src/resources/users/users.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRE_AFTER },
    }),
  ],

  providers: [],
})
export class AuthModule {}
