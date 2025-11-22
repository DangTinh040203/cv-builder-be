import { IsNumber, IsString } from 'class-validator';

export class InformationDto {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsNumber()
  order: number;
}
