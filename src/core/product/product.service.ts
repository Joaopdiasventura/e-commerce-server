import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import type { ProductRepository } from "./repositories/product.repository";
import { UserService } from "../user/user.service";
import { Message } from "../../shared/interfaces/messages/message";
import { FileService } from "../../shared/modules/file/file.service";
import { Product } from "./entities/product.entity";
import { FindProductsDto } from "./dto/find-products.dto";

@Injectable()
export class ProductService {
  public constructor(
    @Inject("IProductRepository")
    private readonly productRepository: ProductRepository,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  public async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<Message> {
    createProductDto.seller = await this.userService.findById(
      createProductDto.sellerId,
    );

    if (!createProductDto.seller.isVerified)
      throw new UnauthorizedException(
        "Valide seu usuário para cadastrar um produto",
      );

    if (createProductDto.seller.type != "seller")
      throw new UnauthorizedException(
        "Apenas vendedores podem cadastrar produtos, torne-se um vendedor para cadastrar seus produtos",
      );

    if (files.length == 0)
      throw new BadRequestException("Envie pelo menos uma imagem");

    createProductDto.mainPicure = await this.fileService.upload(files[0]);
    if (files.length > 0) {
      createProductDto.pictures = [];
      for (let i = 1; i < files.length; i++)
        createProductDto.pictures.push(await this.fileService.upload(files[i]));
    }

    await this.productRepository.create(createProductDto);
    return { message: "Produto adicionado com sucesso" };
  }

  public async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException("Produto não encontrado");
    return product;
  }

  public findMany(
    page: number,
    findProductsDto: FindProductsDto,
  ): Promise<Product[]> {
    return this.productRepository.findMany(page, findProductsDto);
  }

  public async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[],
  ): Promise<Message> {
    const { mainPicure, pictures } = await this.findById(id);
    if (updateProductDto.sellerId) delete updateProductDto.sellerId;

    if (files.length > 0) {
      await this.fileService.delete(mainPicure);
      updateProductDto.mainPicure = await this.fileService.upload(files[0]);
      updateProductDto.pictures = [];

      if (pictures)
        for (let i = 0; i < pictures.length; i++)
          await this.fileService.delete(pictures[i]);
      for (let i = 1; i < files.length; i++)
        updateProductDto.pictures.push(await this.fileService.upload(files[i]));
    }

    await this.productRepository.update(id, updateProductDto);
    return { message: "Produto atualizado com sucesso" };
  }

  public async delete(id: string): Promise<Message> {
    const { mainPicure, pictures } = await this.findById(id);

    await this.fileService.delete(mainPicure);
    if (pictures)
      for (let i = 0; i < pictures.length; i++)
        await this.fileService.delete(pictures[i]);

    await this.productRepository.delete(id);
    return { message: "Produto deletado com sucesso" };
  }
}
