/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://fahad:password123_@gen-use.sjayirh.mongodb.net/ecommerce-devHub_1'), 
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
