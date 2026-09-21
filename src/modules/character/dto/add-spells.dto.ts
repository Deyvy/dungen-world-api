import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AddSpellsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  spellIds!: number[];
}
