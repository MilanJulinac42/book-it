import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServicesService } from './services.service';

@Controller('services')
@UseGuards(AuthGuard('jwt'))
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll() {
    const services = await this.servicesService.findAll();
    return services.map((service) => ({
      ...service,
      capacity_remaining: service.capacity - service.bookings.length,
      bookings: undefined,
    }));
  }
}
