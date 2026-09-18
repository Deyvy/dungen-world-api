import {ArrayNotEmpty, ArrayUnique, IsArray, IsInt} from 'class-validator';

export class SelectEquipmentDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  contentIds!: number[];
}