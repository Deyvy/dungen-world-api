import { EquipmentResponseDto } from '../../equipment/dto/equipment-response.dto';

export class ClassEquipmentOptionResponseDto {
  contentId!: number;
  title!: string;
  content!: string | null;
  equipment!: EquipmentResponseDto;
}

export class CharacterEquipmentResponseDto {
  equipment!: EquipmentResponseDto;
  quantity!: number;
  usesRemaining!: number | null;
  totalRemainingUses!: number | null;
  totalWeight!: number | null;
}
