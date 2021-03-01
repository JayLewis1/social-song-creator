import { Field, ObjectType, Int,  } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn, OneToMany, OneToOne, JoinColumn} from "typeorm";
// Related Entities
import {User} from "./User";
import {Comment} from "./Comment";
import {Likes} from "./Likes";
import {Project} from "./Project";

@ObjectType()
@Entity('posts')
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column("text")
  content: string;

  @Field(() => Int)
  @Column()
  creatorId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "creatorId" })
  creator: User

  @Field()
  @Column("text")
  creatorName: string

  @Field()
  @Column("text")
  avatar: string

  @Field(() => [Likes])
  @OneToMany(() => Likes, (likes) => likes.post)
  likes: Likes[]

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  projectId : string

  @Field(() => Project, { nullable: true })
  @OneToOne(() => Project, (project) => project.post,  { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "projectId" })
  project: Project
  
  @Field(() => Int)
  @Column({type: "int", default : 0})
  shares: number

  @Field()
  @CreateDateColumn()
  created: Date
}