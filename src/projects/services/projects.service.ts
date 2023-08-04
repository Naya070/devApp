import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/projects.entity';
import { CreateProjectDto, FilterProjectDto, UpdateProjectDto } from '../dtos/project.dto';
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
    const roles = await this.rolesService.findRolesByIds(filter.rolesIds);

    return this.projectRepository.find({
      where: {
        status: filter.status,
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
    const developers = await this.devService.findDevelopersByIds(
      project.developerIds,
    );
    project['roles'] = roles;
    project['developers'] = developers;
    console.log(project);
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
}
