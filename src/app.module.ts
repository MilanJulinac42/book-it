import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLE_TTL') || 60,
            limit: configService.get<number>('THROTTLE_LIMIT') || 10,
          },
        ],
      }),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ServicesModule,
    BookingsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
