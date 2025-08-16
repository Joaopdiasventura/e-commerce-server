import { Repository } from "typeorm";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { Payment } from "../entities/payment.entity";
import { PaymentRepository } from "./payment.repository";
import { InjectRepository } from "@nestjs/typeorm";

export class PostgresPaymentRepository implements PaymentRepository {
  public constructor(
    @InjectRepository(Payment)
    private readonly repository: Repository<Payment>,
  ) {}

  public create({ data }: CreatePaymentDto): Promise<Payment> {
    const payment = this.repository.create(data);
    return this.repository.save(payment);
  }

  public findByOrder(order: string): Promise<Payment | null> {
    return this.repository.findOne({
      where: { order: { id: order } },
    });
  }
}
