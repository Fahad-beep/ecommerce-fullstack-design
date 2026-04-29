/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

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
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    return Array.isArray(value) ? value : [value];
  })
  features?: string[];

  @IsOptional()
  @IsString()
  search?: string;
}
