/* eslint-disable prettier/prettier */
import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose'

export type ProductDocument = HydratedDocument<Product>;

@Schema({timestamps: true})
// ■ id, name, price, image, description, category, stock.
export class Product {
    @Prop({ required: true })
    name!: string;

    @Prop({required: true})
    price!: number;

    @Prop({required: true})
    image!: string;

    @Prop()
    description?: string;

    @Prop({required: true})
    category!: string;

    @Prop({required: true, default: 0})
    stock!: number;

    @Prop({required: true})
    brand!: string;

    @Prop({required: true, type: [String]})
    features!: string[];

    @Prop({required: true})
    condition!: string;

    @Prop({required: true, default: 0})
    discount!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product)