import { Query, Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from '../services/roles.service';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto, UpdateRolDto } from '../dtos/rol.dto';
import { DeleteResult } from 'typeorm/driver/mongodb/typings';
import { type } from 'os';

@Resolver(Rol)
export class RolesResolver {
  constructor(private rolesService: RolesService) {}
  @Query(() => [Rol])
  findAllRoles() {
    return this.rolesService.findAll();
  }
  @Query(() => Rol)
  findRolById(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.findRolById(id);
  }
  @Mutation(() => Rol)
  createRol(@Args('rolInput') rolInput: CreateRolDto) {
    return this.rolesService.createRol(rolInput);
  }
  @Mutation(() => Rol)
  updateRol(
    @Args('id', { type: () => Int }) id: number,
    @Args('rolInput') rolInput: UpdateRolDto,
  ) {
    return this.rolesService.updateRol(id, rolInput);
  }

  // @Mutation(() => Rol, { nullable: true })
  // deleteRol(@Args('id') id: number): boolean {
  //   const result = this.rolesService.removeRolById(id);
  //   return true;
  // }
}
