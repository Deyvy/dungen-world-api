import { IsInt, IsNotEmpty } from 'class-validator';

export class SelectAlignmentDto {
  @IsNotEmpty()
  @IsInt()
  contentId!: number;
}