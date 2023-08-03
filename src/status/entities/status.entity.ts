import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Project } from 'src/projects/entities/projects.entity';
import { Developer } from 'src/developers/entities/developer.entity';

@Entity()
@ObjectType()
export class Status {
  //id
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  //name
  @Column({ type: 'varchar', length: 80, unique: true })
  @Field()
  @ManyToOne((type) => Project, (project) => project.status)
  name: Project;
}
