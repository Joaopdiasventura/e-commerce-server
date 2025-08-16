import { InjectRepository } from "@nestjs/typeorm";
import { CreateAddressDto } from "../dto/create-address.dto";
import { Address } from "../entities/address.entity";
import { AddressRepository } from "./address.repository";
import { Repository } from "typeorm";
import { UpdateAddressDto } from "../dto/update-address.dto";

export class PostgresAddressRepository implements AddressRepository {
  public constructor(
    @InjectRepository(Address)
    private readonly repository: Repository<Address>,
  ) {}

  public create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.repository.create(createAddressDto);
    return this.repository.save(address);
  }

  public async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<void> {
    await this.repository.update(id, updateAddressDto);
  }
}
