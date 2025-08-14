import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Message } from "../../shared/interfaces/messages/message";
import { Product } from "./entities/product.entity";
import { FindProductsDto } from "./dto/find-products.dto";
import { ParseFindProductsDtoPipe } from "../../shared/pipes/parse-find-products-dto.pipe";

@Controller("product")
export class ProductController {
  public constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("files"))
  public create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Message> {
    return this.productService.create(createProductDto, files);
  }

  @Get(":id")
  public findById(@Param("id", ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.findById(id);
  }

  @Get("findMany/:page")
  public findMany(
    @Param("page", ParseIntPipe) page: number,
    @Query(ParseFindProductsDtoPipe) findProductsDto: FindProductsDto,
  ): Promise<Product[]> {
    return this.productService.findMany(page < 0 ? 0 : page, findProductsDto);
  }

  @Patch(":id")
  @UseInterceptors(FilesInterceptor("files"))
  public update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Message> {
    return this.productService.update(id, updateProductDto, files);
  }

  @Delete(":id")
  public delete(@Param("id", ParseUUIDPipe) id: string): Promise<Message> {
    return this.productService.delete(id);
  }
}
