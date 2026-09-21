import { IsInt, IsNotEmpty } from 'class-validator';

export class SelectMoveDto {
  @IsNotEmpty()
  @IsInt()
  contentId!: number;
}
