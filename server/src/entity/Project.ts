import { Field, ObjectType , Int} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, OneToOne, JoinColumn, CreateDateColumn} from "typeorm";
// Related Entities
import { User } from "./User";
import { Track } from "./Track";
import { Lyric } from "./Lyric";
import { Tab } from "./Tab";
import { Post } from "./Post";

@ObjectType()
@Entity('projects')
export class Project extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("text")
  name: string;

  @Field()
  @Column("text")
  mainTrack: string;

  @Field()
  @Column()
  isPublic: boolean;

  @Field(() => Int)
  @Column()
  creatorId: number

  @Field(() => String)
  @Column("text")
  creatorName: String

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.projects)
  creator: User

  @OneToMany(() => Lyric, (lyric) => lyric.project)
  lyric: Lyric[];

  @OneToMany(() => Track, (track) => track.project)
  track: Track[];

  @Field(() => [Int])
  @Column("int", {array: true})
  contributors: number[];

  @OneToMany(() => Tab, (tab) => tab.project)
  tab: Tab[]; 

  @Field(() => Int, {nullable: true})
  @Column("int", {nullable: true})
  postId: number;

  @Field(() => Post)
  @OneToOne(() => Post, (post) => post.project)
  @JoinColumn({ name: "postId" })
  post: Post; 
  
  @Field()
  @CreateDateColumn()
  created: Date
}
 

