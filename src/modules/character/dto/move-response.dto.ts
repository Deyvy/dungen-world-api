import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MoveResponseDto {
  @IsString()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  levelRequired?: number;

  @IsNumber()
  @IsNotEmpty()
  content?: string;
}