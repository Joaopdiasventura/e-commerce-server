import { Message } from "./message";
import { User } from "../../../core/user/entities/user.entity";

export interface AuthMessage extends Message {
  token: string;
  user: User;
}
