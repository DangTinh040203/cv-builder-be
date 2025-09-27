import { IsEmail, IsNotEmpty, MinLength, NotContains } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @NotContains(' ')
  password: string;
}
