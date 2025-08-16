import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "../../address/entities/address.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Index()
  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ nullable: false })
  public password?: string;

  @Column({ nullable: true })
  public type?: string;

  @Column({ default: false })
  public isVerified: boolean;

  @OneToOne(() => Address, (address) => address.user, { eager: true })
  public address: Address;
}
