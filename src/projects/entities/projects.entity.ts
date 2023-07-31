import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Rol } from 'src/roles/entities/rol.entity';
import { Developer } from 'src/developers/entities/developer.entity';

enum statusType {
  'In Progress',
  'Pause',
  'Done',
  'Canceled',
  'Other',
}

@ObjectType()
export class Project {
  //id
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  //name
  @Column({ type: 'varchar', length: 80 })
  @Field()
  name: string;
  //description
  @Column({ type: 'varchar', length: 200, nullable: true })
  @Field({ nullable: true })
  description?: string;
  //status
  @Column({ type: 'enum', enum: statusType })
  @Field((type) => statusType)
  status: statusType;
  //role_project
  @Field((type) => Int)
  //role_project
  @OneToMany(() => Rol, (role_proj) => role_proj.project)
  role_project: Rol[];
  //ManyToMany relationship
  @ManyToMany(() => Developer, (developer) => developer.projects)
  @JoinTable()
  developers: Developer[];
}
