import { Module } from '@nestjs/common';
import { DevelopersService } from './services/developers.service';
import { DevelopersResolver } from './resolvers/developers.resolver';
import { Developer } from './entities/developer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/services/roles.service';
import { RolesResolver } from 'src/roles/resolvers/roles.resolver';
import { RolesModule } from 'src/roles/roles.module';
import { Project } from 'src/projects/entities/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Developer, Project]), RolesModule],
  providers: [DevelopersService, DevelopersResolver],
  exports: [DevelopersService],
})
export class DevelopersModule {}
