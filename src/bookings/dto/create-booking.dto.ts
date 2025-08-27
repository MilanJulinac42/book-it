import { IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID('4', { message: 'service_id must be a valid UUID v4' })
  service_id: string;
}
