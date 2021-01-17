import { flatten, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Product } from 'src/model/product';
import { ProductDTO } from 'src/dto/productDTO';
import { ProductUpdateDTO } from 'src/dto/productUpdateDTO';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) {}
      
    public async findAll(): Promise<Product[]> {
        const products:Product[] = await this.productsRepository.find();
        return products;
    }

    public async create(productDTO: ProductDTO): Promise<Product>{
        try {
            if (!await this.validateDuplicity(productDTO)) {
                throw new Error(`Already exist product with name [${productDTO.name}]`, );
            }

            const product = Product.factory(productDTO);

            return await this.productsRepository.save(product);
        } catch (err) {
            throw new Error('Error creating. ' + err);
        }        
    }

    public async update(productUptadeDTO: ProductUpdateDTO): Promise<Product> {
        try {
            const isValid: Boolean = await this.validateDuplicityOnUpdate(productUptadeDTO);
            if (!isValid) {
                throw new Error(`Already exist product with name [${productUptadeDTO.name}]`, );
            }

            let product:Product = await this.productsRepository.findOne({ code: productUptadeDTO.code });

            if (!product) {
                throw new Error(`Error updating product ${productUptadeDTO.code}. Product not found.`);                
            }

            const productNew = Product.factory(productUptadeDTO);
            productNew.id = product.id;

            await this.productsRepository.update(product.id, productNew);
            return productNew;
        } catch (err) {
            throw new Error(`Error updating product ${productUptadeDTO.code}. ` + err);
        }        
    }

    public async getProduct(code: string): Promise<Product> {

        let product: Product;
        try {
            product = await this.productsRepository.findOne({ code });
        } catch (err) {
            throw new Error(`Error searching for product ${code}. ERROR: ${err}`);
        }

        if (!product) {
            throw new Error(`Product not found: ${code}`);
        }

        return product;
    }

    public async delete(code: string) {
        try {
            await this.productsRepository.delete({ code });
        } catch (err) {
            throw new Error(`Error deleting product ${code}. ERROR: ${err}`);
        }    
    }

    /**
     * Check for duplicity on Product.
     * - name
     * @param productDTO ProductDTO
     */
    private async validateDuplicityOnUpdate(productUptadeDTO: ProductUpdateDTO) {

        let isValid = true;

        const where = [{
            name: productUptadeDTO.name,
          }];

        const product: Product = await this.productsRepository.findOne({ where });
        if (product && (productUptadeDTO.code !== product.code)) {
            isValid = false;
        }

        return isValid;
    }

    /**
     * Check for duplicity on Product.
     * - name
     * @param productDTO ProductDTO
     */
    private async validateDuplicity(productDTO: ProductDTO) {
        const where = [{
            name: productDTO.name,
          }];

        const productNumber: Number = await this.productsRepository.count({ where });

        return productNumber > 0 ? false : true;
    }
}
