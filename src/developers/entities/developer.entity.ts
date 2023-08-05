import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Rol } from 'src/roles/entities/rol.entity';
import { Project } from 'src/projects/entities/projects.entity';

@Entity()
@ObjectType()
export class Developer {
  //id
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;
  //name
  @Column({ type: 'varchar', length: 80, unique: true })
  @Field()
  name: string;
  //email
  @Column({ type: 'varchar', length: 50, nullable: true })
  @Field({ nullable: true })
  email?: string;
  //ManyToMany relationship
  @ManyToMany(() => Rol, (rol) => rol.developers, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  roles: Rol[];
  //ManyToMany relationship
  @ManyToMany(() => Project, (project) => project.developers, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  projects: Project[];
}
