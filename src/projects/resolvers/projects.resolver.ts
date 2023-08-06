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
  AssignDeveloperToProjectDto,
  CreateProjectDto,
  FilterProjectDto,
  UpdateProjectDto,
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
    return this.projectService.findAllByRolStatus(filter);
  }
  @Query(() => Project)
  findProjectById(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findProjectById(id);
  }
  @Mutation(() => Project)
  createProject(@Args('ProjectInput') ProjectInput: CreateProjectDto) {
    return this.projectService.createProject(ProjectInput);
  }
  @ResolveProperty(() => [Rol])
  async roles(@Parent() project: Project) {
    return this.projectService.getRoles(project.id);
  }
  @ResolveProperty(() => [Developer])
  async developers(@Parent() project: Project) {
    return this.projectService.getDevelopers(project.id);
  }
  @Mutation(() => Project)
  assignDeveloperToProject(
    @Args('assignDeveloperToProjectInput')
    assignDeveloperToProjectInput: AssignDeveloperToProjectDto,
  ) {
    const { projectId, developerId } = assignDeveloperToProjectInput;
    return this.projectService.assignDeveloperToProject(projectId, developerId);
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteProject(@Args('id') id: number): Promise<boolean> {
    const result = await this.projectService.removeProjectById(id);
    return result;
  }
  @Mutation(() => Project)
  updateProject(
    @Args('id', { type: () => Int }) id: number,
    @Args('ProjectInput') ProjectInput: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, ProjectInput);
  }
}
