import { Module } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { PostgresAddressRepository } from "./repositories/address.postgres.repository";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UserModule],
  controllers: [AddressController],
  providers: [
    AddressService,
    PostgresAddressRepository,
    { provide: "IAddressRepository", useClass: PostgresAddressRepository },
  ],
})
export class AddressModule {}
