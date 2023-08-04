import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  ResolveField,
  Parent,
  ResolveProperty,
} from '@nestjs/graphql';
import { DevelopersService } from '../services/developers.service';
import { Developer } from '../entities/developer.entity';
import { CreateDeveloperDto, FilterDeveloperDto } from '../dtos/developer.dto';
import { RolesService } from 'src/roles/services/roles.service';
import { Rol } from 'src/roles/entities/rol.entity';
@Resolver(Developer)
export class DevelopersResolver {
  constructor(private devService: DevelopersService) {}
  @Query(() => [Developer])
  findAllDeveloper() {
    return this.devService.findAll();
  }
  @Query(() => Developer)
  findDeveloperById(@Args('id', { type: () => Int }) id: number) {
    return this.devService.findDeveloperById(id);
  }
  @Query(() => [Developer])
  findAll(@Args('filter', { nullable: true }) filter?: FilterDeveloperDto) {
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
}
