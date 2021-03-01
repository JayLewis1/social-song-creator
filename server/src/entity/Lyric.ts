import { Field, ObjectType , Int} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
// Related Entities
import { Project } from "./Project";

@ObjectType()
@Entity('lyrics')
export class Lyric extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  lyric: string

  @Field()
  @Column("text")
  option: string  
  
  
  @Field()
  @Column("uuid")
  projectId: string

  @ManyToOne(() => Project, (project) => project.lyric)
  project: Project
}