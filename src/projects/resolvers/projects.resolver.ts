import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../entities/projects.entity';
import {
  CreateProjectDto,
  UpdateProjectDto,
  FilterProjectDto,
  AssignDeveloperToProjectDto,
} from '../dtos/project.dto';
import { Rol } from 'src/roles/entities/rol.entity';
import { Developer } from 'src/developers/entities/developer.entity';
@Resolver(Project)
export class ProjectsResolver {
  constructor(private projectService: ProjectsService) {}

  @Query(() => [Project])
  findAllProject(
    @Args('filter', { nullable: true }) filter?: FilterProjectDto,
  ) {
    return this.projectService.findAll(filter);
  }

  @Query(() => Project)
  findDeveloperById(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findProjectById(id);
  }

  @Query(() => Project)
  findProjectById(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findProjectById(id);
  }

  @Mutation(() => Project)
  createProject(@Args('ProjectInput') ProjectInput: CreateProjectDto) {
    return this.projectService.createProject(ProjectInput);
  }

  @Mutation(() => Project)
  assignDeveloperToProject(
    @Args('assignDeveloperToProjectInput')
    assignDeveloperToProjectInput: AssignDeveloperToProjectDto,
  ) {
    const { projectId, developerId } = assignDeveloperToProjectInput;
    return this.projectService.assignDeveloperToProject(projectId, developerId);
  }

  @ResolveProperty(() => [Rol])
  async roles(@Parent() project: Project) {
    return this.projectService.getRoles(project.id);
  }

  @ResolveProperty(() => [Developer])
  async developers(@Parent() project: Project) {
    return this.projectService.getDevelopers(project.id);
  }
}
