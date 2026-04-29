/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([{
      name: Product.name, schema: ProductSchema
    }]),
    MetadataModule
  ],
  exports: [
    ProductService
  ]
})
export class ProductModule {}
