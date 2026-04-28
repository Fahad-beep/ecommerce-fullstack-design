/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { MetadataSchema, StoreMetadata } from './metadata.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [MetadataController],
  providers: [MetadataService],
  imports: [
    MongooseModule.forFeature([
      {
        name: StoreMetadata.name,
        schema: MetadataSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class MetadataModule {}
