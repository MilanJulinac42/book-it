import { IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID('4', { message: 'Service ID must be valid' })
  service_id: string;
}
