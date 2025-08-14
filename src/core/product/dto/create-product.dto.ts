import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";
import { Transform } from "class-transformer";
import { User } from "../../user/entities/user.entity";

export class CreateProductDto {
  @IsString({ message: "O nome deve ser um texto." })
  @IsNotEmpty({ message: "O nome do produto é obrigatório." })
  public name: string;

  @IsString({ message: "A descrição deve ser um texto." })
  @IsNotEmpty({ message: "A descrição do produto é obrigatória." })
  public description: string;

  @IsUUID(undefined, { message: "O ID do vendedor deve ser um UUID válido." })
  public sellerId: string;

  @Transform(({ value }) => Math.round(Number(value) * 100))
  @IsNumber({}, { message: "O preço deve ser um número inteiro em centavos." })
  @IsPositive({ message: "O preço deve ser maior que zero." })
  public price: number;

  @IsInt({ message: "A quantidade deve ser um número inteiro." })
  @IsPositive({ message: "A quantidade deve ser maior que zero." })
  public quantity: number;

  public mainPicure: string;
  public pictures?: string[];
  public seller: User;
}
