import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Developer } from '../entities/developer.entity';
import {
  CreateDeveloperDto,
  FilterDeveloperDto,
  UpdateDeveloperDto,
} from '../dtos/developer.dto';
import { Rol } from 'src/roles/entities/rol.entity';
import { RolesService } from 'src/roles/services/roles.service';
import { FilterProjectDto } from 'src/projects/dtos/project.dto';
import { Project } from 'src/projects/entities/projects.entity';
@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private devRepository: Repository<Developer>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private rolesService: RolesService,
  ) {}
  findAll(): Promise<Developer[]> {
    return this.devRepository.find();
  }

  async findAllByRolesProjects(
    filter?: FilterDeveloperDto,
  ): Promise<Developer[]> {
    const roles = filter?.rolesIds
      ? await this.rolesService.findRolesByIds(filter.rolesIds)
      : [];
    const projects = filter?.projects
      ? await this.projectRepository.find({
          where: {
            id: In(filter.projects),
          },
        })
      : [];
    return this.devRepository.find({
      where: {
        roles: roles,
        projects: projects,
      },
    });
  }

  async findDeveloperById(id: number): Promise<Developer> {
    return this.devRepository.findOne({
      where: {
        id,
      },
    });
  }
  async findDevelopersByIds(ids: number[]): Promise<Developer[]> {
    return this.devRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
  async createDeveloper(developer: CreateDeveloperDto): Promise<Developer> {
    const roles = await this.rolesService.findRolesByIds(developer.rolesIds);
    developer['roles'] = roles;
    const newDeveloper = this.devRepository.create(developer);
    return this.devRepository.save(newDeveloper);
  }

  async getRoles(id: number): Promise<Rol[]> {
    const developer = await this.devRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
    return developer.roles;
  }
}
