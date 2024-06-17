import { Account } from "src/accounts/entities/account.entity";
import { Category } from "src/categories/entities/category.entity";
import { MoveTypes } from "src/common/interfaces/Moves.interface";
import { Debtor } from "src/debtors/entities/debtor.entity";
import { Label } from "src/labels/entities/label.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:"moves"})
export class Move {

    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text")
    type:MoveTypes

    @Column("float",{
        default:0
    })
    value:number

    @Column("text")
    comment:string
    
    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account:Account //Id

    @ManyToOne(() => Account, { nullable: true })
    @JoinColumn({ name: 'destinyAccountId' })
    destiny_account:Account // Id


    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category; // Relación con la categoría

    @ManyToOne(() => Debtor, { nullable: true })
    @JoinColumn({ name: 'creditorId' })
    creditor: Debtor; // Relación con el acreedor

    @ManyToMany(() => Label, { nullable: true })
    @JoinTable({
        name: 'moves_labels', // Nombre de la tabla intermedia
        joinColumn: { name: 'moveId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'labelId', referencedColumnName: 'id' }
    })
    labels: Label[]; // Relación con múltiples etiquetas (labels)

    @CreateDateColumn({ name: 'createdAt',type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updatedAt',type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deletedAt',type: 'timestamptz' })
    deletedAt: Date;

    @Column("int2",{
        default:0
    })
    pending:0 | 1
}
