/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Product, ProductDocument } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MetadataDocument, StoreMetadata } from 'src/metadata/metadata.schema';

@Injectable()
export class ProductService {

    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(StoreMetadata.name) private metadataModel: Model<MetadataDocument>
    ) {}
    async seedDatabase() {
        await this.productModel.deleteMany({});
        await this.metadataModel.deleteMany({});
        await this.metadataModel.create({
            categories: ['Mobile Accessory', 'Electronics', 'Smartphones', 'Modern Tech', 'Clothes', 'Interior'],
            brands: ['Lenovo', 'Apple', 'Samsung', 'Huawei', 'Pocco'],
            conditions: ['Any', 'Refurbished', 'Brand New', 'Old Items'],
            features: ['Metallic Cover', 'Plastic Cover', '8GB RAM', 'Super Power', 'Waterproof']
        });

        const productsToSeed = [
        // --- CLOTHES ---
        {
            name: 'Tech-Fabric Windbreaker',
            price: 85,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307092/7_en9gwx.jpg',
            description: 'High-performance outer shell designed for harsh weather and durability.',
            category: 'Clothes',
            stock: 100,
            brand: 'Huawei',
            features: ['Waterproof'],
            condition: 'Brand New'
        },
        {
            name: 'Metallic Sheen Puffer Jacket',
            price: 120,
            discount: 15, 
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307091/6_li7jqr.jpg',
            description: 'Modern aesthetic with insulated lining for extreme cold protection.',
            category: 'Clothes',
            stock: 40,
            brand: 'Samsung',
            features: ['Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Protective Rain Poncho',
            price: 25,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307090/5_u6r6ck.jpg',
            description: 'Lightweight and compactable emergency rain gear for commuters.',
            category: 'Clothes',
            stock: 200,
            brand: 'Pocco',
            features: ['Plastic Cover', 'Waterproof'],
            condition: 'Brand New'
        },
        {
            name: 'Vintage Cargo Pants',
            price: 45,
            discount: 40, 
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307090/4_fwku2q.jpg',
            description: 'Classic durable cargo pants from our heritage archive collection.',
            category: 'Clothes',
            stock: 60,
            brand: 'Apple',
            features: ['Waterproof'],
            condition: 'Old Items'
        },
        {
            name: 'Essential Cotton Hoodie',
            price: 55,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307089/3_l6edlt.jpg',
            description: 'Soft-touch cotton blend hoodie for everyday comfort.',
            category: 'Clothes',
            stock: 80,
            brand: 'Samsung',
            features: ['Plastic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Formal Dress Shirt',
            price: 40,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307088/2_cfhwuc.jpg',
            description: 'Wrinkle-free formal shirt perfect for office wear.',
            category: 'Clothes',
            stock: 120,
            brand: 'Apple',
            features: ['Plastic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Outdoor Hybrid Joggers',
            price: 50,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307088/1_zmvnek.jpg',
            description: 'Tapered joggers with water-resistant fabric for active use.',
            category: 'Clothes',
            stock: 55,
            brand: 'Huawei',
            features: ['Waterproof'],
            condition: 'Brand New'
        },

        // --- INTERIOR ---
        {
            name: 'Industrial Metal Bookshelf',
            price: 250,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307117/10_l5xn01.jpg',
            description: 'Reinforced steel frame with a brushed metallic finish.',
            category: 'Interior',
            stock: 15,
            brand: 'Lenovo',
            features: ['Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Smart Recliner Sofa',
            price: 950,
            discount: 10, 
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307116/9_vqhdpn.jpg',
            description: 'Premium leather recliner with super-power motor adjustment.',
            category: 'Interior',
            stock: 5,
            brand: 'Samsung',
            features: ['Super Power'],
            condition: 'Brand New'
        },
        {
            name: 'Ergonomic Executive Chair',
            price: 299,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307115/8_yyd9sm.jpg',
            description: 'Professional high-back chair with custom plastic lumbar support.',
            category: 'Interior',
            stock: 20,
            brand: 'Lenovo',
            features: ['Plastic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Minimalist Floor Lamp',
            price: 85,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307115/7_zr2msk.jpg',
            description: 'Sleek aluminum lamp with a modern metallic aesthetic.',
            category: 'Interior',
            stock: 30,
            brand: 'Apple',
            features: ['Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Designer Glass Table',
            price: 180,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307113/6_svbawu.jpg',
            description: 'Contemporary tempered glass table with metallic legs.',
            category: 'Interior',
            stock: 10,
            brand: 'Samsung',
            features: ['Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Rustic Wood Sideboard',
            price: 450,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307113/3_qi9qod.jpg',
            description: 'Solid wood storage unit, professionally refurbished.',
            category: 'Interior',
            stock: 8,
            brand: 'Pocco',
            features: ['Plastic Cover'],
            condition: 'Refurbished'
        },
        {
            name: 'Acoustic Wall Panel',
            price: 120,
            discount: 15, 
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307112/5_k4eywo.jpg',
            description: 'Sound-dampening panels for home theaters or studios.',
            category: 'Interior',
            stock: 45,
            brand: 'Apple',
            features: ['Plastic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Adjustable Standing Desk',
            price: 550,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307112/4_chn7tm.jpg',
            description: 'Motorized desk with super-power lifting capacity.',
            category: 'Interior',
            stock: 12,
            brand: 'Lenovo',
            features: ['Super Power'],
            condition: 'Brand New'
        },
        {
            name: 'Retro Metal Cabinet',
            price: 135,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307110/2_kyyjbl.jpg',
            description: 'Classic locker-style storage for a vintage interior feel.',
            category: 'Interior',
            stock: 18,
            brand: 'Samsung',
            features: ['Metallic Cover'],
            condition: 'Old Items'
        },
        {
            name: 'Modern Bar Stool',
            price: 65,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307109/1_lp9lhb.jpg',
            description: 'Polymer shell stool with easy-clean plastic finish.',
            category: 'Interior',
            stock: 24,
            brand: 'Pocco',
            features: ['Plastic Cover'],
            condition: 'Brand New'
        },

        // --- TECH ---
        {
            name: 'ThinkPad Performance X1',
            price: 1450,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg',
            description: 'The ultimate business laptop for developers and power users.',
            category: 'Electronics',
            stock: 20,
            brand: 'Lenovo',
            features: ['8GB RAM', 'Super Power'],
            condition: 'Brand New'
        },
        {
            name: 'iPhone Pro Max',
            price: 1099,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/9_fcsvrz.jpg',
            description: 'Leading mobile technology with industry-best camera system.',
            category: 'Smartphones',
            stock: 50,
            brand: 'Apple',
            features: ['Waterproof', '8GB RAM'],
            condition: 'Brand New'
        },
        {
            name: 'Galaxy Buds Pro',
            price: 199,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307064/8_wgaejy.jpg',
            description: 'High-fidelity audio with active noise cancellation.',
            category: 'Mobile Accessory',
            stock: 85,
            brand: 'Samsung',
            features: ['Plastic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Huawei Watch GT',
            price: 299,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307062/7_puqlkn.jpg',
            description: 'Advanced health tracking and long-lasting battery.',
            category: 'Modern Tech',
            stock: 40,
            brand: 'Huawei',
            features: ['Waterproof', 'Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Smart TV Hub',
            price: 49,
            discount: 40, 
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307062/6_vg60z7.jpg',
            description: 'Stream all your favorite content in stunning 4K.',
            category: 'Electronics',
            stock: 150,
            brand: 'Pocco',
            features: ['Plastic Cover', 'Super Power'],
            condition: 'Brand New'
        },
        {
            name: 'Mechanical Gaming Keyboard',
            price: 130,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307062/5_egqiut.jpg',
            description: 'Tactile gaming response with a metallic chassis.',
            category: 'Modern Tech',
            stock: 65,
            brand: 'Samsung',
            features: ['Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'Portable SSD 1TB',
            price: 110,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307061/2_eehpr8.jpg',
            description: 'Ultra-fast file transfers with a durable waterproof casing.',
            category: 'Mobile Accessory',
            stock: 100,
            brand: 'Lenovo',
            features: ['Waterproof', 'Metallic Cover'],
            condition: 'Brand New'
        },
        {
            name: 'iPad Air (Refurbished)',
            price: 450,
            discount: 10, 
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307061/4_arizjr.jpg',
            description: 'Professional tablet performance at an accessible price.',
            category: 'Modern Tech',
            stock: 15,
            brand: 'Apple',
            features: ['8GB RAM'],
            condition: 'Refurbished'
        },
        {
            name: 'Bluetooth High-Bass Speaker',
            price: 75,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307061/3_ij7u4t.jpg',
            description: 'Loud, clear sound with a rugged waterproof build.',
            category: 'Mobile Accessory',
            stock: 90,
            brand: 'Pocco',
            features: ['Waterproof', 'Super Power'],
            condition: 'Brand New'
        },
        {
            name: 'Curved Ultra-Wide Monitor',
            price: 650,
            discount: 0,
            image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307061/1_b1f77q.jpg',
            description: 'Immersive screen for professional design and gaming.',
            category: 'Electronics',
            stock: 22,
            brand: 'Samsung',
            features: ['Metallic Cover', 'Super Power'],
            condition: 'Brand New'
        }
        ];
        await this.productModel.insertMany(productsToSeed)
        return {
            message: "database successfully seeded with metadata and products"
        }
    }
}
