import { CreateProductDto } from "../dto/create-product.dto";
import { FindProductsDto } from "../dto/find-products.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entities/product.entity";

export interface ProductRepository {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findMany(page: number, findProductsDto: FindProductsDto): Promise<Product[]>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<void>;
  delete(id: string): Promise<void>;
}
