import { IsNumber, IsOptional, IsString } from "class-validator";

export class FindProductsDto {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public seller?: string;

  @IsNumber()
  @IsOptional()
  public price?: number;
}
