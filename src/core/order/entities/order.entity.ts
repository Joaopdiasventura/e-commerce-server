import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { OrderProduct } from "./order-product.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "int", nullable: false })
  public value: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  public createdAt: Date;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn()
  public user?: User;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
    cascade: true,
    eager: true,
  })
  public products?: OrderProduct[];
}
