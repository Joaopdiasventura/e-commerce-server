import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { Product } from "./entities/product.entity";
import { UserModule } from "../user/user.module";
import { FileModule } from "../../shared/modules/file/file.module";
import { PostgresProductRepository } from "./repositories/product.postgres.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule, FileModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    PostgresProductRepository,
    { provide: "IProductRepository", useClass: PostgresProductRepository },
  ],
  exports: [ProductService],
})
export class ProductModule {}
