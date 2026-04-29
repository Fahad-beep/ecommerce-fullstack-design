/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { forwardRef, Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { MetadataSchema, StoreMetadata } from './metadata.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from 'src/product/product.module';

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
    forwardRef(() => ProductModule),
  ],
  exports: [MongooseModule],
})
export class MetadataModule {}
