import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { FindProductsDto } from "../../core/product/dto/find-products.dto";

@Injectable()
export class ParseFindProductsDtoPipe implements PipeTransform {
  public transform(value: FindProductsDto): FindProductsDto {
    const dto = plainToInstance(FindProductsDto, value);
    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0)
      throw new BadRequestException(
        errors
          .flatMap((err) => Object.values(err.constraints || {}))
          .join("; "),
      );

    return dto;
  }
}
