import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Reflector } from '@nestjs/core';

describe('ProductController', () => {
  let controller: ProductController;

  const productService = {
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    getProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: JwtAuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: AuthService, useValue: { verifyAccessToken: jest.fn() } },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });

  it('delegates product listing to the service', async () => {
    productService.getProducts.mockResolvedValue({ data: [], meta: {} });

    await controller.getAllProducts({ page: 1, limit: 12 });

    expect(productService.getProducts).toHaveBeenCalledWith({
      page: 1,
      limit: 12,
    });
  });

  it('delegates product creation to the service', async () => {
    productService.createProduct.mockResolvedValue({ _id: '1' });

    await controller.createProduct({
      name: 'Lamp',
      price: 99,
      image: 'https://cdn.example.com/lamp.jpg',
      category: 'Home',
      stock: 10,
      brand: 'North',
      features: ['light'],
      condition: 'new',
      discount: 5,
      description: 'Desk lamp',
    });

    expect(productService.createProduct).toHaveBeenCalled();
  });
});
