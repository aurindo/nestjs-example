import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Product } from '../model/product';

export class ProductDTO {

  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: Number;

  constructor(name: string, description: string, price: Number, code: string) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.code = code;
  }

  static factory(product: Product): ProductDTO {
    return new ProductDTO(product.name, product.description, product.price, product.code);
  }
}
