import { Field, ObjectType , Int} from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm";
// Related Entities
import { Project } from "./Project";

@ObjectType()
@Entity('tabs')
export class Tab extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [String])
  @Column("text", {array: true})
  tab: string[];

  @Field()
  @Column("text")
  description: string  
  
  @Field()
  @Column("uuid")
  projectId: string

  @ManyToOne(() => Project, (project) => project.tab)
  project: Project
}