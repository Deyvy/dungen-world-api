import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  appearance?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  strength?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  dexterity?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  constitution?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  intelligence?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  wisdom?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  charisma?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  hpCurrent?: number;
}
