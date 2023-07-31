import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from 'src/projects/entities/projects.entity';
import { Developer } from 'src/developers/entities/developer.entity';

@ObjectType()
export class Rol {
  //id
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  //name
  @Column({ type: 'varchar', length: 80, unique: true })
  @Field()
  name: string;
  //Developer
  //No necesita JoinColum porque él automáticamente
  //sabe que el decorador que el decorador que
  // tiene la relación manyToOne es la que
  //debe tener la FK
  @ManyToOne(() => Developer, (developer) => developer.role_developer)
  developer: Developer;
  //Project
  @ManyToOne(() => Project, (project) => project.role_project)
  project: Project;
}
