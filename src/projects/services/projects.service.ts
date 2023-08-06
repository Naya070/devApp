import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/projects.entity';
import { CreateProjectDto, FilterProjectDto } from '../dtos/project.dto';
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
    const rolesSet = new Set(project.rolesIds);
    const developersSet = new Set(project.developerIds);
    const rolesArr = [...rolesSet];
    const developersArr = [...developersSet];
    const roles = await this.rolesService.findRolesByIds(rolesArr);
    const developers = project?.developerIds
      ? await this.devService.findDevelopersByIds(developersArr)
      : [];
    project['roles'] = roles;
    project['developers'] = developers;
    const newProject = this.projectRepository.create(project);

    developers.forEach((dev) => {
      this.devService.validateSameRolesDeveloperAndProject(newProject, dev);
    });

    return this.projectRepository.save(newProject);
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

  async assignDeveloperToProject(projectId: number, developerId: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
      },
      relations: ['developers', 'roles'],
    });
    const developer = await this.devService.findDeveloperById(developerId);
    this.devService.validateSameRolesDeveloperAndProject(project, developer);
    project.developers = [...project.developers, developer];
    return this.projectRepository.save(project);
  }

  async removeProjectById(id: number) {
    const project = await this.projectRepository.findOne({
      relations: {
        developers: true,
        roles: true,
      },
      where: { id },
    });
    //Delete relations from the:
    //intermediate table rol-developer
    project.developers = [];
    //intermediate table rol-projects
    project.roles = [];
    await this.projectRepository.save(project);
    const rolRemove = await this.projectRepository.delete(id);

    if (rolRemove.affected >= 1) {
      return true;
    } else {
      return false;
    }
  }
}
