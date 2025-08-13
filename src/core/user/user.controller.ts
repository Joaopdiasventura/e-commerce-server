import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { AuthMessage } from "../../shared/interfaces/messages/auth-message";
import { Message } from "../../shared/interfaces/messages/message";
import { ParseLoginUserDtoPipe } from "../../shared/pipes/parse-login-user-dto.pipe";

@Controller("user")
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<AuthMessage> {
    return this.userService.create(createUserDto);
  }

  @Get("login")
  public login(
    @Query(ParseLoginUserDtoPipe) loginUserDto: LoginUserDto,
  ): Promise<AuthMessage> {
    return this.userService.login(loginUserDto);
  }

  @Get("decodeToken/:token")
  public decodeToken(@Param("token") token: string): Promise<User> {
    return this.userService.decodeToken(token);
  }

  @Patch(":token")
  public update(
    @Param("token") token: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    return this.userService.update(token, updateUserDto);
  }

  @Patch(":token")
  public validateEmail(@Param("token") token: string): Promise<Message> {
    return this.userService.validateEmail(token);
  }

  @Delete(":token")
  public delete(@Param("token") token: string): Promise<Message> {
    return this.userService.delete(token);
  }
}
