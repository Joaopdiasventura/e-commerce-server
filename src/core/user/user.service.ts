import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserGateway } from "./user.gateway";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthService } from "../../shared/modules/auth/auth.service";
import { EmailService } from "../../shared/modules/email/email.service";
import { AuthMessage } from "src/shared/interfaces/messages/auth-message";
import type { UserRepository } from "./repositories/user.repository";
import { User } from "./entities/user.entity";
import { Message } from "src/shared/interfaces/messages/message";

@Injectable()
export class UserService {
  public constructor(
    @Inject("IUserRepository") private readonly userRepository: UserRepository,
    private readonly userGateway: UserGateway,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<AuthMessage> {
    await this.throwIfEmailIsUsed(createUserDto.email);
    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    const user = await this.userRepository.create(createUserDto);
    delete user.password;
    const token = await this.authService.generateToken(user.id);
    await this.emailService.sendMail({
      to: user.email,
      subject: "VALIDAÇÃO DE CONTA",
      html: this.emailService.createValidationButton(token),
    });
    return { message: "Valide sua conta no email " + user.email, token, user };
  }

  public async login(loginUserDto: LoginUserDto): Promise<AuthMessage> {
    const user = await this.findByEmail(loginUserDto.email);
    await this.authService.comparePassword(
      loginUserDto.password,
      user.password!,
    );
    delete user.password;
    const token = await this.authService.generateToken(user.id);
    return { message: "Valide sua conta no email " + user.email, token, user };
  }

  public async decodeToken(token: string): Promise<User> {
    const id = await this.authService.decodeToken(token);
    const user = await this.findById(id);
    delete user.password;
    return user;
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("Usuário não encontrado");
    return user;
  }

  public async update(
    token: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    const { id, email } = await this.decodeToken(token);
    if (updateUserDto.email && email != updateUserDto.email) {
      await this.throwIfEmailIsUsed(updateUserDto.email);
      await this.emailService.sendMail({
        to: updateUserDto.email,
        subject: "VALIDAÇÃO DE CONTA",
        html: this.emailService.createValidationButton(token),
      });
      updateUserDto.isVerified = false;
    }
    if (updateUserDto.password)
      updateUserDto.password = await this.authService.hashPassword(
        updateUserDto.password,
      );
    if (updateUserDto.type) delete updateUserDto.type;

    await this.userRepository.update(id, updateUserDto);
    return { message: "Usuário atualizado com sucesso" };
  }

  public async changeType(token: string): Promise<Message> {
    const { id, type } = await this.decodeToken(token);
    await this.userRepository.update(id, {
      type: type == "seller" ? undefined : "seller",
    });
    return { message: "Parabéns por se tornar um vendedor" };
  }

  public async validateEmail(token: string): Promise<Message> {
    const { id, email } = await this.decodeToken(token);
    await this.userRepository.update(id, { isVerified: true });
    this.userGateway.emailValidated(email);
    return { message: "Conta validada com sucesso" };
  }

  public async delete(token: string): Promise<Message> {
    const { id } = await this.decodeToken(token);
    await this.userRepository.delete(id);
    return { message: "Usuário deletado com sucesso" };
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException("Email não cadastrado");
    return user;
  }

  private async throwIfEmailIsUsed(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user)
      throw new BadRequestException("Esse email já está sendo utilizado");
  }
}
