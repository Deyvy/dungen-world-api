import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MoveElementDto {
  @IsInt()
  elementId!: number;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  optionIds?: number[];
}

export class UpdateMoveDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoveElementDto)
  elements!: MoveElementDto[];
}