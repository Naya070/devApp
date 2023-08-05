import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  Parent,
  ResolveProperty,
} from '@nestjs/graphql';
import { DevelopersService } from '../services/developers.service';
import { Developer } from '../entities/developer.entity';
import {
  CreateDeveloperDto,
  FilterDeveloperDto,
  UpdateDeveloperDto,
} from '../dtos/developer.dto';
import { Rol } from 'src/roles/entities/rol.entity';
@Resolver(Developer)
export class DevelopersResolver {
  constructor(private devService: DevelopersService) {}
  @Query(() => [Developer])
  @Query(() => Developer)
  findDeveloperById(@Args('id', { type: () => Int }) id: number) {
    return this.devService.findDeveloperById(id);
  }
  @Query(() => [Developer])
  findAllDevelopers(
    @Args('filter', { nullable: true }) filter?: FilterDeveloperDto,
  ) {
    return this.devService.findAllByRolesProjects(filter);
  }
  @Mutation(() => Developer)
  createDeveloper(@Args('DeveloperInput') DeveloperInput: CreateDeveloperDto) {
    return this.devService.createDeveloper(DeveloperInput);
  }
  @ResolveProperty(() => [Rol])
  async roles(@Parent() developer: Developer) {
    return this.devService.getRoles(developer.id);
  }
  @Mutation(() => Boolean, { nullable: true })
  async deleteDeveloper(@Args('id') id: number): Promise<boolean> {
    const result = await this.devService.removeDeveloperById(id);
    return result;
  }
  @Mutation(() => Developer)
  updateDeveloper(
    @Args('id', { type: () => Int }) id: number,
    @Args('DeveloperInput') rolInput: UpdateDeveloperDto,
  ) {
    return this.devService.updateDeveloper(id, rolInput);
  }
}
