import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"currencies"})
export class Currency {
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text")
    name:string
    
    @Column("text")
    code:string

    @Column("text")
    symbol:string
}