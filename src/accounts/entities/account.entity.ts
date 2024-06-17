import { AccountTypes } from 'src/common/interfaces/Accounts.interface';
import { MoveTypes } from 'src/common/interfaces/Moves.interface';
import { Currency } from 'src/currencies/entities/currency.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne,  PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('text')
  name: string;

  @Column('text',{nullable:true})
  description: string;

  @Column('text')
  type:AccountTypes

    @ManyToOne(() => Currency, { nullable: false })
    @JoinColumn({ name: 'currencyId' })
    currency: Currency;

  @Column('float', {
    default: 0,
  })
  init_balance: number;

  @Column('float', {
    default: 0,
  })
  balance: number;


  @Column("text",{nullable:true})
  color: string;

  @Column("text",{nullable:true})
  icon: string;

  @Column('float', {
    default: null,
  })
  min: number;

  @Column('float', {
    default: null,
  })
  max: number;

  @CreateDateColumn({ name: 'createdAt',type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt',type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt',type: 'timestamptz' })
  deletedAt: Date;
}
