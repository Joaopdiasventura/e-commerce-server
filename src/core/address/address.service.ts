import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import type { AddressRepository } from "./repositories/address.repository";
import { UserService } from "../user/user.service";
import { Message } from "../../shared/interfaces/messages/message";

@Injectable()
export class AddressService {
  public constructor(
    @Inject("IAddressRepository")
    private readonly addressRepository: AddressRepository,
    private readonly userService: UserService,
  ) {}

  public async create(createAddressDto: CreateAddressDto): Promise<Message> {
    createAddressDto.user = await this.userService.findById(
      createAddressDto.userId,
    );
    await this.addressRepository.create(createAddressDto);
    return { message: "Endereço adicionado com sucesso" };
  }

  public async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Message> {
    try {
      if (updateAddressDto.userId) delete updateAddressDto.userId;
      await this.addressRepository.update(id, updateAddressDto);
      return { message: "Endereço atualizado com sucesso" };
    } catch {
      throw new NotFoundException("Endereço não encontrado");
    }
  }
}
