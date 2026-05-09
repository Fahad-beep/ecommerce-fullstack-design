/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  Max,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Min(1)
  @IsNumber()
  @Type(() => Number)
  limit?: number = 12;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return Array.isArray(value) ? value : [value];
  })
  category?: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return Array.isArray(value) ? value : [value];
  })
  features?: string[];

  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Min(0)
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @Min(0)
  @Max(5)
  @IsNumber()
  @Type(() => Number)
  minRating?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value == 'true' || value == true)
  hasDiscount?: boolean;
}
