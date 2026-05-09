/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  price!: number;

  @IsString()
  name!: string;

  @IsString()
  brand!: string;

  @IsString({ each: true })
  @Transform(({ value }) => {
    return Array.isArray(value) ? value : [value];
  })
  features!: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  image!: string;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsString()
  condition!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  rating?: number;
}
