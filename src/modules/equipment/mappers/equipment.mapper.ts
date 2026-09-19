import {
  EquipmentMetadataDto,
  EquipmentResponseDto,
} from '../dto/equipment-response.dto';

export type EquipmentRecord = {
  id: number;
  name: string;
  description: string | null;
  metadata: string | null;
};

export class EquipmentMapper {
  static toMetadata(raw: string | null): EquipmentMetadataDto {
    const fallback: EquipmentMetadataDto = {
      weight: null,
      tags: [],
      category: null,
      usesPerUnit: null,
    };

    if (!raw) return fallback;

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return fallback;
      }

      const value = parsed as Record<string, unknown>;
      return {
        weight:
          typeof value.weight === 'number' && Number.isFinite(value.weight)
            ? value.weight
            : null,
        tags: Array.isArray(value.tags)
          ? value.tags.filter((tag): tag is string => typeof tag === 'string')
          : [],
        category: typeof value.category === 'string' ? value.category : null,
        usesPerUnit:
          typeof value.usesPerUnit === 'number' &&
          Number.isInteger(value.usesPerUnit) &&
          value.usesPerUnit > 0
            ? value.usesPerUnit
            : null,
      };
    } catch {
      return fallback;
    }
  }

  static toResponse(equipment: EquipmentRecord): EquipmentResponseDto {
    return {
      id: equipment.id,
      name: equipment.name,
      description: equipment.description,
      metadata: EquipmentMapper.toMetadata(equipment.metadata),
    };
  }
}
