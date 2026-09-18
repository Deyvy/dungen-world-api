import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export enum CharacterStat {
  STRENGTH = 'strength',
  DEXTERITY = 'dexterity',
  CONSTITUTION = 'constitution',
  INTELLIGENCE = 'intelligence',
  WISDOM = 'wisdom',
  CHARISMA = 'charisma',
}

export class LevelUpDto {
  @IsEnum(CharacterStat)
  stat!: CharacterStat;

  @IsInt()
  @IsNotEmpty()
  moveId!: number;
}
