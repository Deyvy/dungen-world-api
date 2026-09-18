import { IsInt } from 'class-validator';

export class SelectRaceDto {
  @IsInt()
  contentId!: number;
}