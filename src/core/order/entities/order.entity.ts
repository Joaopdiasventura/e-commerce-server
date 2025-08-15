import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "int", nullable: false })
  public value: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  public createdAt: Date;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn()
  public user?: User;
}
