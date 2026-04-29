/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MetadataDocument, StoreMetadata } from 'src/metadata/metadata.schema';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateMetadataDto } from './dto/update-metadata.dto';


export interface PaginatedProducts {
    data: ProductDocument[],
    meta: {
        totalCount: number,
        currentPage?: number,
        totalPages: number
    }
}

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(StoreMetadata.name) private metadataModel: Model<MetadataDocument>
    ) {}

    async getProducts(filterDto: GetProductsFilterDto) : Promise<PaginatedProducts> {
        const {brand, category, features, limit, page, search} = filterDto
        interface queryProps {
            category?: string,
            brand?: string,
            features?: string[],
            name?: string | { $regex: string, $options: string }
        }
        const query: queryProps = {}

        if (category) query.category = category
        if (brand) query.brand = brand
        if (features) query.features = features

        if (search)
            query.name = {
                $regex: search,
                $options: "i"
            }
        const skipAmount = (page! - 1) * limit!;
        const [data, totalCount] = await Promise.all([
            this.productModel.find(query).skip(skipAmount).limit(limit!).exec(),
            this.productModel.countDocuments(query).exec()
        ])
        return {
            data,
                meta: {
                    totalCount,
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit!)
                }
        }
    }

    async createProduct(createProductDto: CreateProductDto) : Promise<ProductDocument> {
        return await this.productModel.create(createProductDto);
    }

    async getProductById(id: string) {
        return this.productModel.findById(id).exec()
    }

    async updateProduct(id: string, updateDto: UpdateProductDto) {
        return await this.productModel.findByIdAndUpdate(id, 
            updateDto, {new: true}
        ).exec()
    }

    async deleteProduct(id: string) {
        return await this.productModel.findByIdAndDelete(id).exec();
    }

    async getMetadata() {
        return await this.metadataModel.findOne().exec();
    }

    async updateMetadata(updateMetadataDto: UpdateMetadataDto) {
        const { action, fields, value } = updateMetadataDto
        const updateOperation = action === 'add' ?
        { $addToSet: {[fields] : value }} :
        { $pull : { [fields] : value }}

        return await this.metadataModel.findOneAndUpdate({}, updateOperation, {new: true}).exec();
    }
}
