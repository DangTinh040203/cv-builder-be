import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtp {
  @IsNotEmpty()
  @Length(6)
  otp: string;

  @IsEmail()
  email: string;
}
