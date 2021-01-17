import { Controller, Get, Response, HttpStatus, Post, Body, HttpException, Param, Delete, Put } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { ProductsService } from 'src/service/products/products.service';

import { ValidationPipe } from 'src/pipe/validation.pipe';

import { Product } from 'src/model/product';
import { ProductDTO } from 'src/dto/productDTO';
import { ProductUpdateDTO } from 'src/dto/ProductUpdateDTO';


@Controller('api/products')
export class ProductsController {
    private readonly logger = new Logger(ProductsController.name);

    constructor(private readonly productsService: ProductsService) {}

    @Get()
    public async listProducts (@Response() res: any) {
        this.logger.debug('Input: listProducts');
        try {
            const products:Product[] = await this.productsService.findAll();
            const productsDTO:ProductDTO[] =
                products.map(product => ProductDTO.factory(product)) as ProductDTO[];

            this.logger.debug(productsDTO, 'Output: listProducts');
            return res.status(HttpStatus.OK).json(productsDTO);
        } catch (err) {
            this.logger.error(err, 'output: listProducts');
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    @Get(':code')
    public async getProduct (@Param('code') code, @Response() res: any) {
        this.logger.debug(code, 'Input: getProduct');
        try {
            const product:Product = await this.productsService.getProduct(code);
            const productDTO:ProductDTO = ProductDTO.factory(product);

            this.logger.debug(productDTO, 'Output: getProduct');
            return res.status(HttpStatus.OK).json(productDTO);
        } catch (err) {
            this.logger.error(err, 'output: getProduct');
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    @Delete(':code')
    public async delete (@Param('code') code, @Response() res: any) {
        this.logger.debug(code, 'Input: delete');
        try {
            await this.productsService.delete(code);
            this.logger.debug('Output: delete');
            return res.status(HttpStatus.OK);
        } catch (err) {
            this.logger.error(err, 'output: delete');
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post()
    public async create(@Body(new ValidationPipe()) productDTO: ProductDTO, @Response() res: any) {
        this.logger.debug(productDTO, 'Input: create');
        try {
            const newProduct: Product = await this.productsService.create(productDTO);
            const productResponse: ProductDTO = ProductDTO.factory(newProduct);
            
            this.logger.debug(productResponse, 'Output: create');
            return res.status(HttpStatus.CREATED).json(productResponse);
        } catch (err) {
            this.logger.error(err, 'output: create');
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put()
    public async update(@Body(new ValidationPipe()) productUpateDTO: ProductUpdateDTO, @Response() res: any) {
        this.logger.debug(productUpateDTO, 'Input: update');
        try {
            const newProduct: Product = await this.productsService.update(productUpateDTO);
            const productResponse: ProductUpdateDTO = ProductUpdateDTO.factory(newProduct);
            
            this.logger.debug(productResponse, 'Output: update');
            return res.status(HttpStatus.OK).json(productResponse);
        } catch (err) {
            this.logger.error(err, 'output: update');
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
