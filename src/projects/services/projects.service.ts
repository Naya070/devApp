import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/projects.entity';
import {
  CreateProjectDto,
  FilterProjectDto,
  UpdateProjectDto,
} from '../dtos/project.dto';
import { RolesService } from 'src/roles/services/roles.service';
import { Rol } from 'src/roles/entities/rol.entity';
import { DevelopersService } from 'src/developers/services/developers.service';
import { Developer } from 'src/developers/entities/developer.entity';
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private rolesService: RolesService,
    private devService: DevelopersService,
  ) {}
  findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findAllByRolStatus(filter: FilterProjectDto): Promise<Project[]> {
    const roles = filter?.rolesIds
      ? await this.rolesService.findRolesByIds(filter.rolesIds)
      : [];
    return this.projectRepository.find({
      where: {
        status: filter?.status,
        roles: roles,
      },
    });
  }

  async findProjectById(id: number): Promise<Project> {
    return this.projectRepository.findOne({
      where: {
        id,
      },
    });
  }

  async createProject(project: CreateProjectDto): Promise<Project> {
    const roles = await this.rolesService.findRolesByIds(project.rolesIds);
    const developers = project?.developerIds
      ? await this.devService.findDevelopersByIds(project.developerIds)
      : [];
    project['roles'] = roles;
    project['developers'] = developers;
    const newDeveloper = this.projectRepository.create(project);
    return this.projectRepository.save(newDeveloper);
  }

  async getRoles(id: number): Promise<Rol[]> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
    return project.roles;
  }

  async getDevelopers(id: number): Promise<Developer[]> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
      },
      relations: ['developers'],
    });
    return project.developers;
  }

  validateSameRolesDeveloperAndProject(project: Project, developer: Developer) {
    const roles = project.roles.map((role) => role.id);
    const developerRoles = developer.roles.map((role) => role.id);
    const sameRoles = roles.filter((role) => developerRoles.includes(role));
    if (sameRoles.length === 0) {
      throw new Error(
        `The developer ${developer.name} does not have the roles for the project ${project.name}`,
      );
    }
  }

  async assignDeveloperToProject(projectId: number, developerId: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
      },
      relations: ['developers', 'roles'],
    });
    const developer = await this.devService.findDeveloperById(developerId);
    this.validateSameRolesDeveloperAndProject(project, developer);
    project.developers = [...project.developers, developer];
    return this.projectRepository.save(project);
  }
}
