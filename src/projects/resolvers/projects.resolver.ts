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
import { CreateProjectDto, UpdateProjectDto } from '../dtos/project.dto';
import { Rol } from 'src/roles/entities/rol.entity';
import { Developer } from 'src/developers/entities/developer.entity';
@Resolver(Project)
export class ProjectsResolver {
  constructor(private projectService: ProjectsService) {}
  @Query((returns) => [Project])
  findAllProject() {
    return this.projectService.findAll();
  }
  @Query(() => Project)
  findDeveloperById(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findProjectById(id);
  }
  @Query((returns) => Project)
  findProjectById(@Args('id', { type: () => Int }) id: number) {
    return this.projectService.findProjectById(id);
  }
  @Mutation((returns) => Project)
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
}
