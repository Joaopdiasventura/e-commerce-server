import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { Order } from "./order.entity";

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "int", nullable: false })
  public quantity: number;

  @ManyToOne(() => Product, {
    onDelete: "SET NULL",
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  public product?: Product;

  @ManyToOne(() => Order, (order) => order.products, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  public order: Order;
}
