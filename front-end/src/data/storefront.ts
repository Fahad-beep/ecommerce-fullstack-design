import type { Product } from '../api/products.api';

export const categoryMenu = [
  'Automobiles',
  'Clothes and wear',
  'Home interiors',
  'Computer and tech',
  'Tools, equipments',
  'Sports and outdoor',
  'Animal and pets',
  'Machinery tools',
  'More category',
];

export const mobileHomeTabs = ['All category', 'Gadgets', 'Clocthes', 'Accessory'];
export const mobileListTabs = ['Tablets', 'Phones', 'Ipads', 'Ipod', 'Jack'];

export const fallbackProducts: Product[] = [
  {
    _id: 'fallback-shirt',
    name: 'T-shirts with multiple colors, for men',
    price: 10.3,
    image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg',
    description: 'Product with multiple colors and modern marketplace details.',
    category: 'Clothing',
    stock: 154,
    discount: 25,
    rating: 4.5,
    brand: 'Artel Market',
    condition: 'Brand new',
    features: ['Plastic', 'Medium size'],
  },
  {
    _id: 'fallback-jacket',
    name: 'Brown winter coat medium size',
    price: 12.5,
    image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg',
    description: 'Warm winter coat with reliable supplier information.',
    category: 'Clothing',
    stock: 154,
    discount: 15,
    rating: 4.5,
    brand: 'Best factory LLC',
    condition: 'Brand new',
    features: ['Cotton', 'Blue'],
  },
  {
    _id: 'fallback-phone',
    name: 'Canon camera black, 100x zoom',
    price: 99.5,
    image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg',
    description: 'Electronics product with free shipping and verified seller.',
    category: 'Electronics',
    stock: 154,
    discount: 40,
    rating: 4.5,
    brand: 'Samsung',
    condition: 'Brand new',
    features: ['Metallic', '64GB'],
  },
  {
    _id: 'fallback-watch',
    name: 'Smartwatch silver color modern',
    price: 34,
    image: 'https://res.cloudinary.com/dngqowfel/image/upload/v1777307065/10_iqpoi9.jpg',
    description: 'Modern smartwatch for daily use.',
    category: 'Mobile Accessory',
    stock: 154,
    discount: 25,
    rating: 4.5,
    brand: 'Apple',
    condition: 'Brand new',
    features: ['Super power', 'Large Memory'],
  },
];

export const getDisplayProducts = (products: Product[], count: number) => {
  const source = products.length ? products : fallbackProducts;
  return Array.from({ length: count }, (_, index) => source[index % source.length]);
};

export const formatPrice = (value: number) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

export const oldPrice = (product: Product) => {
  if (!product.discount) return null;
  return product.price + product.price * (product.discount / 100);
};
