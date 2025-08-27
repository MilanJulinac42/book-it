import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      select: {
        id: true,
        title: true,
        start_time: true,
        end_time: true,
        capacity: true,
        is_group: true,
        price_points: true,
        bookings: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
