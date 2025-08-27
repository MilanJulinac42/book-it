import { IsEmail, IsString, MinLength } from "class-validator"

export class RegisterDto {
  @IsEmail({}, { message: 'Not correct email format.' })
  email: string;

  @IsString()
  @MinLength(6, {message: 'Password must have 6 characters or more'})
  password: string;
}
