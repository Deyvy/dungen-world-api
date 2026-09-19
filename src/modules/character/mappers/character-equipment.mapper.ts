import {
  ClassEquipmentOptionResponseDto,
  CharacterEquipmentResponseDto,
} from '../dto/equipment-response.dto';
import {
  EquipmentMapper,
  EquipmentRecord,
} from '../../equipment/mappers/equipment.mapper';

export class CharacterEquipmentMapper {
  static toClassOption(
    option: EquipmentRecord & {
      classContentId: number;
      title: string;
      content: string | null;
    },
  ): ClassEquipmentOptionResponseDto {
    return {
      contentId: option.classContentId,
      title: option.title,
      content: option.content,
      equipment: EquipmentMapper.toResponse(option),
    };
  }

  static toCharacterResponse(row: {
    equipment: EquipmentRecord;
    quantity: number;
    usesRemaining: number | null;
  }): CharacterEquipmentResponseDto {
    const equipment = EquipmentMapper.toResponse(row.equipment);
    const usesPerUnit = equipment.metadata.usesPerUnit;

    return {
      equipment,
      quantity: row.quantity,
      usesRemaining: row.usesRemaining,
      totalRemainingUses:
        usesPerUnit && row.usesRemaining !== null
          ? (row.quantity - 1) * usesPerUnit + row.usesRemaining
          : null,
      totalWeight:
        equipment.metadata.weight === null
          ? null
          : equipment.metadata.weight * row.quantity,
    };
  }
}
