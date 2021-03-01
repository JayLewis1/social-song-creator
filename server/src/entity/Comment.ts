import { Field, ObjectType, Int } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
// Related Entities
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  postId: number

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post

  @Field(() => Int)
  @Column()
  userId: number

  @Field()
  @Column("text")
  userName: string

  @Field()
  @Column("text")
  avatar: string

  @Field()
  @Column("text")
  comment: string;

  @Field()
  @CreateDateColumn()
  created: Date
}