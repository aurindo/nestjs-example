import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Product } from '../model/product';
import { ProductDTO } from '../dto/productDTO';

export class ProductUpdateDTO extends ProductDTO {

  @IsString()
  @IsNotEmpty()  
  code: string;

  constructor(name: string, description: string, price: Number, code: string) {
    super(name, description, price, code);
  }
}
