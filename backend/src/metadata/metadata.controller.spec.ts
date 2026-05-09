import { Test, TestingModule } from '@nestjs/testing';
import { MetadataController } from './metadata.controller';
import { ProductService } from '../product/product.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Reflector } from '@nestjs/core';

describe('MetadataController', () => {
  let controller: MetadataController;

  const productService = {
    getMetadata: jest.fn(),
    updateMetadata: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetadataController],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: JwtAuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: AuthService, useValue: { verifyAccessToken: jest.fn() } },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();

    controller = module.get<MetadataController>(MetadataController);
    jest.clearAllMocks();
  });

  it('delegates metadata reads to the product service', () => {
    controller.getMetadata();

    expect(productService.getMetadata).toHaveBeenCalled();
  });
});
