import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { User } from "../../user/entities/user.entity";
import { Product } from "../../product/entities/product.entity";

class OrderProductDto {
  @IsUUID("4", { message: "Produto inválido. O ID deve ser um UUID válido." })
  @IsNotEmpty({ message: "O campo 'productId' é obrigatório." })
  public productId: string;

  @IsInt({ message: "Quantidade inválida. Deve ser um número inteiro." })
  @IsNotEmpty({ message: "O campo 'quantity' é obrigatório." })
  public quantity: number;

  public product: Product;
}

export class CreateOrderDto {
  
  @IsUUID(undefined, {
    message: "Usuário inválido. O ID deve ser um UUID válido.",
  })
  public userId: string;
  
  @IsArray({ message: "Produtos inválidos. Deve ser uma lista de produtos." })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  public products: OrderProductDto[];
  
  public value: number;
  public user: User;
}
