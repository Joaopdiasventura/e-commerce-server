import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Order } from "../../order/entities/order.entity";

@Entity()
export class Payment {
  @PrimaryColumn()
  public id: string;

  @PrimaryColumn("int")
  public value: number;

  @PrimaryColumn("varchar")
  public method: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  public createdAt: Date;

  @Index({ unique: true })
  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn()
  public order: Order;
}
