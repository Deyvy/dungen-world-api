import { IsInt, Min } from 'class-validator';

export class AddEquipmentDto {
  @IsInt()
  @Min(1)
  quantity = 1;
}
