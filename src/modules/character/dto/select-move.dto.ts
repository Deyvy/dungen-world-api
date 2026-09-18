import { IsNotEmpty, IsNumber } from 'class-validator';

export class SelectMoveDto {
  @IsNotEmpty()
  @IsNumber()
  contentId!: number;
}