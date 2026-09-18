import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  classId!: number;

  @IsArray()
  @IsString({ each: true })
  appearance?: string[];

  @IsInt()
  hpCurrent!: number;
  
  @IsInt()
  @Min(1)
  @Max(18)
  strength!: number;

  @IsInt()
  @Min(1)
  @Max(18)
  dexterity!: number;

  @IsInt()
  @Min(1)
  @Max(18)
  constitution!: number;

  @IsInt()
  @Min(1)
  @Max(18)
  intelligence!: number;

  @IsInt()
  @Min(1)
  @Max(18)
  wisdom!: number;

  @IsInt()
  @Min(1)
  @Max(18)
  charisma!: number;
}