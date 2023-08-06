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
      relations: ['roles'],
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
    const oldDeveloper = await this.devRepository.findOne({
      where: {
        id,
      },
      relations: ['roles', 'projects', 'projects.roles'],
    });

    const newDeveloper = await this.devRepository.merge(oldDeveloper, changes);
    if (changes.rolesIds) {
      const rolesArr = await this.rolesService.findRolesByIds(changes.rolesIds);
      newDeveloper['roles'] = rolesArr;
    }

    // if (changes.projectsIds) {
    //   const projectsArr = await this.projectRepository.find({
    //     where: {
    //       id: In(changes.projectsIds),
    //     },
    //     relations: ['roles'],
    //   });
    //   newDeveloper['projects'] = projectsArr;
    // }

    newDeveloper.projects.forEach((project) => {
      this.validateSameRolesDeveloperAndProject(project, newDeveloper);
    });

    console.log(newDeveloper, 'update');

    return this.devRepository.save(newDeveloper);
  }

  validateSameRolesDeveloperAndProject(project: Project, developer: Developer) {
    const roles = project.roles?.map((role) => role.id) || [];
    const developerRoles = developer.roles.map((role) => role.id);
    const sameRoles = roles.filter((role) => developerRoles.includes(role));
    if (sameRoles.length === 0) {
      throw new Error(
        `The developer ${developer.name} does not have the roles for the project ${project.name}`,
      );
    }
  }

  async Arr(id: number): Promise<Developer[]> {
    const developerArr = await this.devRepository.find({
      where: {
        id: id,
      },
      relations: ['roles'],
    });
    return developerArr;
  }
}
