import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public generateToken(payload: string): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public async decodeToken(token: string): Promise<string> {
    try {
      return `${await this.jwtService.verifyAsync(token)}`;
    } catch {
      throw new BadRequestException("Faça login novamente");
    }
  }

  public async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>("salts")!;
    return (await hash(password, saltRounds)) as string;
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isValid = await compare(password, hashedPassword);
    if (!isValid) throw new UnauthorizedException("Senha incorreta");
  }
}
