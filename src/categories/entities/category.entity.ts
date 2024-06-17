import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"categories"})
export class Category {
    @PrimaryGeneratedColumn("increment")
    id:number

    @Column("text",{ unique: true })
    name:string

    @ManyToOne(() => Category, category => category.children, { nullable: true })
    @JoinColumn({ name: "parent" })
    parent: Category;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

    @Column("text",{nullable:true})
    icon:string

    @Column("text",{nullable:true})
    color:string

    @Column("text",{nullable:true})
    color2:string
}
