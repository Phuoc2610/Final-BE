import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './app/profile/profile.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { MyJwtGuard } from './common/guard/jwt-auth.guard';
import { CategoryModule } from './app/category/category.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    AuthModule,
    ProfileModule,
    PrismaModule,
    CategoryModule
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    MyJwtGuard
  ],
})
export class AppModule {}
