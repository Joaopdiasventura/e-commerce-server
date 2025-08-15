import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../product/entities/product.entity";

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "int", nullable: false })
  public quantity: number;

  @ManyToOne(() => Order, { onDelete: "SET NULL", nullable: true })
  @JoinColumn()
  public order?: Order;

  @ManyToOne(() => Product, { onDelete: "SET NULL", nullable: true })
  @JoinColumn()
  public product?: Product;
}
