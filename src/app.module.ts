import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, ServicesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
