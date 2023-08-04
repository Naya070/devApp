import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Project } from 'src/projects/entities/projects.entity';
import { Developer } from 'src/developers/entities/developer.entity';

@Entity()
@ObjectType()
export class Rol {
  //id
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;
  //name
  @Column({ type: 'varchar', length: 80, unique: true })
  @Field()
  name: string;
  //developers
  @ManyToMany(() => Developer, (developer) => developer.roles)
  developers: Developer[];
  //ManyToMany relationship
  @ManyToMany(() => Project, (project) => project.roles)
  projects: Project[];
}
