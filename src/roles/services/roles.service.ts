import { Injectable } from '@nestjs/common';
import { Rol } from '../entities/rol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRolDto, UpdateRolDto } from '../dtos/rol.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Rol) private rolRepository: Repository<Rol>) {}

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findRolById(id: number): Promise<Rol> {
    return this.rolRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findRolesByIds(ids: number[]): Promise<Rol[]> {
    return this.rolRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  createRol(rol: CreateRolDto): Promise<Rol> {
    const newRol = this.rolRepository.create(rol);
    return this.rolRepository.save(newRol);
  }

  async updateRol(id: number, changes: UpdateRolDto): Promise<Rol> {
    const newRol = await this.rolRepository.findOne({
      where: {
        id,
      },
    });
    this.rolRepository.merge(newRol, changes);
    return this.rolRepository.save(newRol);
  }

  async removeRolById(id: number) {
    const rolRemove = await this.rolRepository.delete(id);
    console.log(rolRemove);
    if (rolRemove.affected >= 1) {
      return true;
    } else {
      return false;
    }
  }
}
