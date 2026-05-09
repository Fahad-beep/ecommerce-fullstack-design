/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { MetadataModule } from '../metadata/metadata.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    MongooseModule.forFeature([{
      name: Product.name, schema: ProductSchema
    }]),
    forwardRef(() => MetadataModule),
    AuthModule,
  ],
  exports: [
    ProductService
  ]
})
export class ProductModule {}
