import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ProductDTO } from 'src/dto/productDTO';
import { ProductUpdateDTO } from 'src/dto/productUpdateDTO';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false , unique: true})
  code: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0, })
  price: Number;

  constructor(name: string, description: string, price: Number, code: string) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.code = code ? code : uuidv4();
  }

  static factory(productDTO: ProductDTO): Product {
    return new Product(
      productDTO.name, productDTO.description, productDTO.price, productDTO.code);
  }

}