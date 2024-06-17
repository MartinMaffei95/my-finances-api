import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"debtors"})
export class Debtor {
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text")
    name:string
    
    @Column("text")
    icon:string

    @Column("text")
    color:string
}