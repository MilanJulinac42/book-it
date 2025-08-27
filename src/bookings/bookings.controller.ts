import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: { user: User },
  ) {
    return this.bookingsService.createBooking(createBookingDto, req.user);
  }

  @Get(':id/ics')
  async getIcs(@Param('id') bookingId: string, @Res() res: Response) {
    const booking = await this.bookingsService.findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const icsEvent = this.bookingsService.generateIcsEvent(booking);
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="booking-${bookingId}.ics"`,
    );
    res.send(icsEvent);
  }
}
