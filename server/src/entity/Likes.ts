import { Field, ObjectType, Int } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
// Related Entities
import { Post } from "./Post";

@ObjectType()
@Entity()
export class Likes extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  postId: number

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post

  @Field(() => Int)
  @Column()
  userId: number
}