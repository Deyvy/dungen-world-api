import { CharacterResponseDto } from '../dto/character-response.dto';

export class CharacterMapper {
  static toResponse(character: any): CharacterResponseDto {
    return {
      id: character.id,
      name: character.name,
      level: character.level,
      hpCurrent: character.hpCurrent,
      
      class: {
        id: character.class.id,
        name: character.class.name,
      },

      appearance: character.appearance
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.content),

      stats: {
        strength: character.strength,
        dexterity: character.dexterity,
        constitution: character.constitution,
        intelligence: character.intelligence,
        wisdom: character.wisdom,
        charisma: character.charisma,
      },
    };
  }
}