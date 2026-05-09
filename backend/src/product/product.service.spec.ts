import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { StoreMetadata } from '../metadata/metadata.schema';

const createQuery = (result: unknown) => ({
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(result),
});

describe('ProductService', () => {
  let service: ProductService;

  const productQuery = createQuery([{ _id: '1', name: 'Chair' }]);
  const productModel = {
    find: jest.fn(() => productQuery),
    countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
    create: jest.fn().mockResolvedValue({ _id: '2', name: 'Table' }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '1', name: 'Chair' }) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '1', name: 'Desk' }) }),
    findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ _id: '1' }) }),
  };

  const metadataModel = {
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ categories: ['Home'] }) }),
    findOneAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ categories: ['Home', 'Tech'] }) }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product.name), useValue: productModel },
        { provide: getModelToken(StoreMetadata.name), useValue: metadataModel },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('returns paginated products with filters', async () => {
    await service.getProducts({
      search: 'chair',
      category: ['Home'],
      hasDiscount: true,
      minPrice: 25,
      maxPrice: 500,
      minRating: 4,
      limit: 10,
      page: 2,
    });

    expect(productModel.find).toHaveBeenCalledWith(
      expect.objectContaining({
        category: { $in: ['Home'] },
        discount: { $gt: 0 },
        price: { $gte: 25, $lte: 500 },
        rating: { $gte: 4 },
        $or: expect.any(Array),
      }),
    );
    expect(productQuery.skip).toHaveBeenCalledWith(10);
    expect(productQuery.limit).toHaveBeenCalledWith(10);
  });

  it('creates and updates products', async () => {
    await expect(
      service.createProduct({
        name: 'Table',
        price: 120,
        image: 'https://cdn.example.com/table.jpg',
        category: 'Home',
        stock: 5,
        brand: 'North',
        features: ['wood'],
        condition: 'new',
        discount: 15,
        description: 'Dining table',
      }),
    ).resolves.toMatchObject({ _id: '2', name: 'Table' });

    await expect(
      service.updateProduct('1', { name: 'Desk' }),
    ).resolves.toMatchObject({ _id: '1', name: 'Desk' });
  });

  it('reads and updates metadata', async () => {
    await expect(service.getMetadata()).resolves.toMatchObject({
      categories: ['Home'],
    });

    await expect(
      service.updateMetadata({
        action: 'add',
        fields: 'categories',
        value: 'Tech',
      }),
    ).resolves.toMatchObject({
      categories: ['Home', 'Tech'],
    });
  });
});
