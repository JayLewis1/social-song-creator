import { Field, ObjectType , Int} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn} from "typeorm";
// Related Entities
import { User } from "./User";

@ObjectType()
@Entity('notifications')
export class Notification extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
 
  @Field()
  @Column("text")
  message: string;

  @Field(() => Int)
  @Column()
  recipient: number

  @Field(() => Int)
  @Column()
  senderId: number

  @Field()
  @Column("text")
  senderName: string

  @Field()
  @Column("text")
  avatar: string

  @Field(() => Boolean)
  @Column({ default : false})
  read: boolean;

  @Field()
  @Column("text")
  type: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User

  @Field()
  @CreateDateColumn()
  created: Date
}