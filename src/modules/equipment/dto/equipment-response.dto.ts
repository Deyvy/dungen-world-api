export class EquipmentMetadataDto {
  weight!: number | null;
  tags!: string[];
  category!: string | null;
  usesPerUnit!: number | null;
}

export class EquipmentResponseDto {
  id!: number;
  name!: string;
  description!: string | null;
  metadata!: EquipmentMetadataDto;
}
