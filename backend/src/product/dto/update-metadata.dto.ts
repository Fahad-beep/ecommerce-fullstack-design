/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsIn, IsString } from 'class-validator';

export class UpdateMetadataDto {
  @IsIn(['add', 'remove'])
  action!: string;

  @IsIn(['categories', 'brands', 'conditions', 'features'])
  fields!: string;

  @IsString()
  value!: string;
}
