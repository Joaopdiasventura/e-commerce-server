import { CreateAddressDto } from "../dto/create-address.dto";
import { UpdateAddressDto } from "../dto/update-address.dto";
import { Address } from "../entities/address.entity";

export interface AddressRepository {
  create(createAddressDto: CreateAddressDto): Promise<Address>;
  update(id: string, updateAddressDto: UpdateAddressDto): Promise<void>;
}
