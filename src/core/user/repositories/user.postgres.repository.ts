import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { User } from "../entities/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class PostgresUserRepository implements UserRepository {
  public constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  public findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    await this.repository.update(id, updateUserDto);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
