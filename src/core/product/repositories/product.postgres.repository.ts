import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";
import { FindProductsDto } from "../dto/find-products.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Product } from "../entities/product.entity";
import { ProductRepository } from "./product.repository";

export class PostgresProductRepository implements ProductRepository {
  public constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  public create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.repository.create(createProductDto);
    return this.repository.save(product);
  }

  public findById(id: string): Promise<Product | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["seller"],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
        mainPicure: true,
        pictures: true,
        seller: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }

  public async findMany(
    page: number,
    findProductsDto: FindProductsDto,
  ): Promise<Product[]> {
    const qb = this.repository
      .createQueryBuilder("product")
      .leftJoin("product.seller", "seller")
      .addSelect(["seller.id", "seller.name", "seller.email"])
      .take(10)
      .skip(page * 10);

    if (findProductsDto?.name)
      qb.andWhere("product.name ILIKE :name", {
        name: `%${findProductsDto.name}%`,
      });

    if (findProductsDto?.seller)
      qb.andWhere("seller.id ILIKE :seller", {
        seller: `%${findProductsDto.seller}%`,
      });

    if (typeof findProductsDto?.price == "number")
      qb.andWhere("product.price <= :price", { price: findProductsDto.price });

    return qb.getMany();
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    await this.repository.update(id, updateProductDto);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
