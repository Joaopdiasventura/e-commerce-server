import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PostgresUserRepository } from "./repositories/user.postgres.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { AuthModule } from "../../shared/modules/auth/auth.module";
import { EmailModule } from "src/shared/modules/email/email.module";
import { UserGateway } from "./user.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, EmailModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserGateway,
    PostgresUserRepository,
    {
      provide: "IUserRepository",
      useExisting: PostgresUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
