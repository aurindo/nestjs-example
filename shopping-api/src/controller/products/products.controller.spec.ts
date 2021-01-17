import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { when } from 'jest-when';

import { ProductsController } from './products.controller';
import { ProductsService } from '../../service/products/products.service';
import { Product } from '../../model/product';


describe('ProductsController', () => {
  let productsController: ProductsController;
  let app: INestApplication;

  beforeEach(async () => {

    const allProducts = [
      {
        "id": 1,
        "name": "casa1",
        "code": "b594602d-32c7-46499-8a65-146a86512dbc",
        "description": "muito caro",
        "price": 99.00,
      },
      {
        "id": 2,
        "name": "casa2",
        "code": "b594602d-46499-8a65-32c7-146a86512dbc",
        "description": "muito caro",
        "price": 999999.00,
      },
    ];

    const productsRepository = {
      find: jest.fn().mockResolvedValue(allProducts),
      findOne: jest.fn().mockResolvedValue(allProducts[0]),
    }
   
    const module = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productsRepository
        }
      ],
    })
      .compile();
    app = module.createNestApplication();
    await app.init();
  })

  describe('when receives a request to list all products', () => {
    it('should respond the list of all productsDTO without ID', () => {
      const expectedData = [
        {
          "name": "casa1",
          "code": "b594602d-32c7-46499-8a65-146a86512dbc",
          "description": "muito caro",
          "price": 99.00,
        },
        {
          "name": "casa2",
          "code": "b594602d-46499-8a65-32c7-146a86512dbc",
          "description": "muito caro",
          "price": 999999.00,
        },
      ]

      return request(app.getHttpServer())
        .get('/api/products')
        .expect(HttpStatus.OK)
        .expect(expectedData);
    })
  });

  describe('when receives a request to get the details from a specific product', () => {
    it('should respond the productsDTO without ID', () => {
      const expectedData = {
        "name": "casa1",
        "code": "b594602d-32c7-46499-8a65-146a86512dbc",
        "description": "muito caro",
        "price": 99.00,
        };

      return request(app.getHttpServer())
        .get('/api/products/b594602d-32c7-46499-8a65-146a86512dbc')
        .expect(HttpStatus.OK)
        .expect(expectedData);
    });

    describe('and the product was not found', () => {
      it('should respond return a 404 error', () => {
        const expectedData = {
          "name": "casa1",
          "code": "b594602d-32c7-46499-8a65-146a86512dbc",
          "description": "muito caro",
          "price": 99.00,
          };

        return request(app.getHttpServer())
          .get('/api/products/xpto')
          .expect(HttpStatus.OK)
          .expect(expectedData);
      });
    });
  });

});
