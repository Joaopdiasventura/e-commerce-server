import { User } from "../../user/entities/user.entity";
import {
  IsNotEmpty,
  IsPostalCode,
  IsString,
  Length,
  IsUUID,
} from "class-validator";

export class CreateAddressDto {
  @IsNotEmpty({ message: "Informe um CEP válido" })
  @IsPostalCode("BR", { message: "CEP inválido" })
  public zipCode: string;

  @IsNotEmpty({ message: "Informe o nome da rua" })
  @IsString()
  public streetName: string;

  @IsNotEmpty({ message: "Informe o número da rua" })
  @IsString()
  public streetNumber: string;

  @IsString({ message: "Complemento inválido" })
  public complement: string;

  @IsNotEmpty({ message: "Informe o bairro" })
  @IsString()
  public neighborhood: string;

  @IsNotEmpty({ message: "Informe a cidade" })
  @IsString()
  public city: string;

  @IsNotEmpty({ message: "Informe a unidade federativa" })
  @IsString()
  @Length(2, 2, { message: "Unidade federativa deve ter 2 caracteres (sigla)" })
  public federalUnit: string;

  @IsNotEmpty({ message: "Informe o usuário" })
  @IsUUID(undefined, { message: "ID de usuário inválido" })
  public userId: string;

  public user: User;
}
