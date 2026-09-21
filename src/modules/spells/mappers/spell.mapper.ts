import { spells } from '../../../generated/prisma/client';
import { SpellResponseDto } from '../dto/spell-response.dto';

type SpellRecord = Pick<
  spells,
  | 'id'
  | 'name'
  | 'spellLevel'
  | 'description'
  | 'metadata'
  | 'isActive'
  | 'sortOrder'
>;

export class SpellMapper {
  static toResponse(spell: SpellRecord): SpellResponseDto {
    return {
      id: spell.id,
      name: spell.name,
      spellLevel: spell.spellLevel,
      description: spell.description,
      metadata: spell.metadata,
      isActive: spell.isActive,
      sortOrder: spell.sortOrder,
    };
  }
}
