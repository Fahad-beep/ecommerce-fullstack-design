/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec()
    }
}
