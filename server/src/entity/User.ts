import { Field, ObjectType , Int} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn} from "typeorm";
// Related Entities
import { Post } from  "./Post";
import { Project } from "./Project";
import { Notification } from "./Notification";


@ObjectType()
@Entity('users')
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("text")
    email: string;

    @Column("text")
    password: string;

    @Field()
    @Column("text")
    firstName: string

    @Field()
    @Column("text")
    lastName: string

    @Field()
    @Column("text")
    dob: string
  
    @Field()
    @Column({ nullable: true })
    bio: string

    @Field()
    @Column({ nullable: true })
    instruments: string

    @Field()
    @Column("text")
    avatar: string

    @Field(() => [Int])
    @Column("int", {array: true})
    mates: number[];

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[]
  
    @OneToMany(() => Project, (project) => project.creator)
    projects: Project[]

    @Field(() => [String])
    @Column("text")
    contributions: string[];
  
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[]

    @Field()
    @CreateDateColumn()
    created: Date
    
    @Column("int", {default: 0})
    tokenVersion: number;
}
 