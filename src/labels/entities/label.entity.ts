import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"labels"})
export class Label {
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text")
    name:string
    
    @Column("text")
    icon:string

    @Column("text")
    color:string
}
