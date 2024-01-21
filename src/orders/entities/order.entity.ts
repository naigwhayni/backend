import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  orderName: string;

  @Column()
  amount: number;

  @Column()
  orderDescription: string;
}
