import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/graphql';

@InputType()
export class CreateRolDto {
  @MinLength(1)
  @MaxLength(80)
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;
}

@InputType()
export class UpdateRolDto extends PartialType(CreateRolDto) {}
