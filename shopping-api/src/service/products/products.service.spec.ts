import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { Product } from '../../model/product';

describe('ProductsService', () => {
  let productsService: ProductsService;

  const allProducts = [
    {
      "id": 1,
      "name": "casa1",
      "description": "muito caro",
      "price": 99.00,
    },
    {
      "id": 2,
      "name": "casa2",
      "description": "muito caro",
      "price": 999999.00,
    },
  ];

  const productsRepository = {
    find: jest.fn().mockResolvedValue(allProducts),
    // save: jest.fn().mockReturnValue(Promise.resolve())
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productsRepository
        }
      ],
    })
      .compile();
      productsService = await module.get(ProductsService);
  });

  describe('list all products', () => {
    it('should respond the list of all products with ID', async () => {
      const expectedData = [{
          "id": 1,
          "name": "casa1",
          "description": "muito caro",
          "price": 99.00,
        },
        {
          "id": 2,
          "name": "casa2",
          "description": "muito caro",
          "price": 999999.00,
        },
      ]

      const products: Product[] = await productsService.findAll();
      expect(products).toEqual(expectedData);
    })
  });
});
