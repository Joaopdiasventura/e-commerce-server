import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Message } from "../../shared/interfaces/messages/message";

@Controller("address")
export class AddressController {
  public constructor(private readonly addressService: AddressService) {}

  @Post()
  public create(@Body() createAddressDto: CreateAddressDto): Promise<Message> {
    return this.addressService.create(createAddressDto);
  }

  @Patch(":id")
  public update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Message> {
    return this.addressService.update(id, updateAddressDto);
  }
}
