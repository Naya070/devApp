import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateDeveloperDto {
  @MinLength(1)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
  @MinLength(1)
  @MaxLength(80)
  @IsString()
  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @Field(() => [Number], { nullable: true })
  rolesIds?: number[];

  @IsOptional()
  @Field(() => [Number], { nullable: true })
  projectsIds?: number[];
}

@InputType()
export class UpdateDeveloperDto {
  @MinLength(1)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
  @MinLength(1)
  @MaxLength(80)
  @IsString()
  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @Field(() => [Number], { nullable: true })
  rolesIds?: number[];
}
@InputType()
export class FilterDeveloperDto {
  @IsOptional()
  @Field(() => [Number], { nullable: true })
  rolesIds?: number[];
  @IsOptional()
  @Field(() => [Number], { nullable: true })
  projects?: number[];
}
