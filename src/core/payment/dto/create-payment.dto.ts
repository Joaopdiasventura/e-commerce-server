import { IsNotEmpty } from "class-validator";

export class CreatePaymentDto {
  @IsNotEmpty() public data: { id: string };
}
