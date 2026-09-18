import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { contentElements } from '../../../generated/prisma/browser';

export class MoveDetailsDto {
  @IsInt()
  id!: number;

  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsArray()
  elements?: any[];
}