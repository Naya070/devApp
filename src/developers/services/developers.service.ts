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
import { Project } from 'src/projects/entities/projects.entity';
@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private devRepository: Repository<Developer>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private rolesService: RolesService,
  ) {}
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
      relations: ['roles', 'projects'],
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
    const rolesArr = await this.rolesService.findRolesByIds(developer.rolesIds);
    //Evitar repetidos
    const rolesSet = new Set(rolesArr);
    const roles = [...rolesSet];
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
  async removeDeveloperById(id: number) {
    const developer = await this.devRepository.findOne({
      relations: {
        projects: true,
        roles: true,
      },
      where: { id },
    });
    //Delete relations from the:
    //intermediate table developer-project
    developer.projects = [];
    //intermediate table developer-rol
    developer.roles = [];
    await this.devRepository.save(developer);
    const devRemove = await this.devRepository.delete(id);
    if (devRemove.affected >= 1) {
      return true;
    } else {
      return false;
    }
  }
  async updateDeveloper(
    id: number,
    changes: UpdateDeveloperDto,
  ): Promise<Developer> {
    const developer = await this.devRepository.findOne({
      where: {
        id,
      },
      relations: {
        projects: true,
        roles: true,
      },
    });
    developer.projects = [];
    developer.roles = [];
    await this.devRepository.save(developer);
    await this.devRepository.merge(developer, changes);
    return this.devRepository.save(changes);
  }
}
