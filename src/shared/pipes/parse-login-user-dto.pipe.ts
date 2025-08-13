import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { LoginUserDto } from "../../core/user/dto/login-user.dto";

@Injectable()
export class ParseLoginUserDtoPipe implements PipeTransform {
  public transform(value: LoginUserDto): LoginUserDto {
    const dto = plainToInstance(LoginUserDto, value);
    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0)
      throw new BadRequestException(
        "Validation failed: " +
          errors
            .flatMap((err) => Object.values(err.constraints || {}))
            .join("; "),
      );

    return dto;
  }
}
