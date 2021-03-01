import { Field, ObjectType , Int} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
// Related Entities
import { Project } from "./Project";

@ObjectType()
@Entity('tracks')
export class Track extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text")
  name: string

  @Field()
  @Column({type: 'bytea',  nullable: false })
  buffer: Buffer 
  
  @Field()
  @Column("uuid")
  projectId: string

  @ManyToOne(() => Project, (project) => project.lyric)
  project: Project
}