import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { InformationDto } from './information.dto';
import { Section } from '@/lib/types/resume.type';
import { Resume } from '@/user/entities/resume.entity';

export class UpdateResumeDto extends PartialType(
  OmitType(Resume, ['userId'] as const),
) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subTitle?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string | null;

  @IsOptional()
  @IsString()
  overview?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InformationDto)
  information?: InformationDto[];

  @IsOptional()
  @IsObject()
  section?: Partial<Section>;
}
