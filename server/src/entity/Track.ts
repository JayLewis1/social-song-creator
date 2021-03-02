import { Field, ObjectType } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
// Related Entities
import { Project } from "./Project";

@ObjectType()
@Entity('tracks')
export class Track extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @Field()
  // @Column("uuid")
  // projectId: string

  @Field()
  @Column("text")
  name: string

  @Field()
  @Column("uuid")
  projectId: string

  @ManyToOne(() => Project, (project) => project.lyric)
  project: Project
}