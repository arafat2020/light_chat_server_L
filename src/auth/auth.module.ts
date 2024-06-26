import { Module, Global, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DbModule } from 'src/db/db.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config/dist/config.service";
import { AuthMiddleware } from './auth.middleware';




@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [DbModule, JwtModule.register({
    global: true,
    secret: new ConfigService().get('JWT_SECRET'),
    signOptions: { expiresIn: '60s' },
  })],
})

@Global()
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: 'auth/signUp',
        method: RequestMethod.POST
      })
  }
}