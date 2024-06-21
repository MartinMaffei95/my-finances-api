import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({name:"configs"})
export class Configuration {
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text",{unique: true })
    name:string

    @Column("text")
    description:string

    @Column("text")
    value:string

    @Column("text")
    default:string
}
