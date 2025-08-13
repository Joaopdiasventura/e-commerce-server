import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ default: false })
  public isVerified: boolean;
}
