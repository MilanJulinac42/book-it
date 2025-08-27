import { IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID('4', { message: 'Service ID must be a valid UUID' })
  service_id: string;

  @IsUUID('4', { message: 'Idempotency key must be a valid UUID.' })
  idempotency_key: string;
}
