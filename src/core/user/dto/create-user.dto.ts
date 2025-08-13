import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Digite um email válido" })
  public email: string;

  @IsString({ message: "Digite um nome válido" })
  @IsNotEmpty({ message: "Digite um nome válido" })
  public name: string;

  @IsStrongPassword({}, { message: "Digite uma senha válida" })
  public password: string;
}
