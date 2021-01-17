import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//Controller
import { AppController } from './app.controller';
import { ProductsController } from './controller/products/products.controller';

//Service
import { AppService } from './app.service';
import { ProductsService } from './service/products/products.service';

//Model
import { Product } from './model/product';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'nana',
    entities: [Product],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Product])],
  controllers: [AppController, ProductsController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
