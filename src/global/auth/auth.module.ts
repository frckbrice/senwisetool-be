import { Module } from '@nestjs/common'
import { UsersModule } from 'src/resources/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { CurrentPlanIds } from '../plan-id/current-plan-ids'

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRE_AFTER },
    }),
  ],

  providers: [CurrentPlanIds],
})
export class AuthModule { }
