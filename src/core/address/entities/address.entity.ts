import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  Index,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public zipCode: string;

  @Column()
  public streetName: string;

  @Column()
  public streetNumber: string;

  @Column()
  public complement: string;

  @Column()
  public neighborhood: string;

  @Column()
  public city: string;

  @Column()
  public federalUnit: string;

  @Index({ unique: true })
  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn()
  public user: User;
}
