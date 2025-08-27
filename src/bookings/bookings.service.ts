import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto, user: User) {
    const { service_id } = createBookingDto;

    const service = await this.prisma.service.findUnique({
      where: { id: service_id },
      include: { bookings: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found.');
    }

    if (user.points_balance < service.price_points) {
      throw new ForbiddenException('Not enough points to book this service.');
    }

    const bookingsCount = service.bookings.length;
    if (service.is_group && bookingsCount >= service.capacity) {
      throw new BadRequestException('Service capacity exceeded.');
    }
    if (!service.is_group && bookingsCount > 0) {
      throw new BadRequestException('Individual service is already booked.');
    }

    const booking = await this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { points_balance: { decrement: service.price_points } },
      });

      return await prisma.booking.create({
        data: {
          user_id: user.id,
          service_id: service.id,
        },
        include: { user: true, service: true },
      });
    });

    const whatsappPayload = this.generateWhatsappPayload(booking);
    const icsEvent = this.generateIcsEvent(booking);

    return {
      booking,
      whatsappPayload,
      icsEvent,
    };
  }

  async findBookingById(bookingId: string) {
    return this.prisma.booking.findUnique({ 
      where: { id: bookingId },
      include: { user: true, service: true },
    });
  }

  private generateWhatsappPayload(booking: any) {
    return {
      to: booking.user.email,
      template: 'booking_confirmation',
      params: {
        serviceTitle: booking.service.title,
        start: booking.service.start_time.toISOString(),
        end: booking.service.end_time.toISOString(),
      },
    };
  }

   generateIcsEvent(booking: any) {
    const start = booking.service.start_time
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    const end = booking.service.end_time
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Book-It//NONSGML//EN\nBEGIN:VEVENT\nUID:${booking.id}\nDTSTAMP:${start}\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${booking.service.title}\nEND:VEVENT\nEND:VCALENDAR`;
  }
}
