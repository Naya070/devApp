import { Injectable } from '@nestjs/common';
import { Status } from '../entities/status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateStatusDto, UpdateStatusDto } from '../dtos/status.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status) private statusRepository: Repository<Status>,
  ) {}

  // async findAll(): Promise<Status[]> {
  //   return this.rolRepository.find();
  // }

  // async findRolById(id: number): Promise<Status> {
  //   return this.rolRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  // async findRolesByIds(ids: number[]): Promise<Status[]> {
  //   return this.rolRepository.find({
  //     where: {
  //       id: In(ids),
  //     },
  //   });
  // }

  createRol(status: CreateStatusDto): Promise<Status[]> {
    const newRol = this.statusRepository.create(status);
    return this.statusRepository.save(newRol);
  }

  // async updateRol(id: number, changes: UpdateRolDto): Promise<Rol> {
  //   const newRol = await this.rolRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  //   this.rolRepository.merge(newRol, changes);
  //   return this.rolRepository.save(newRol);
  // }

  // removeRolById(id: number) {
  //   return this.rolRepository.delete(id);
  // }
}
