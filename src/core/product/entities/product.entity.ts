import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public name: string;

  @Column({ type: "text", nullable: false })
  public description: string;

  @ManyToOne(() => User, { onDelete: "SET NULL", nullable: true })
  @JoinColumn()
  public seller?: User;

  @Column({ type: "int", nullable: false })
  public price: number;

  @Column({ type: "int", nullable: false })
  public quantity: number;

  @Column({ type: "text", nullable: false })
  public mainPicure: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  public updatedAt: Date;

  @Column("text", { array: true })
  public pictures?: string[];
}
