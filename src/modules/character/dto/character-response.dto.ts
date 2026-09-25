export class CharacterResponseDto {
  id!: number;
  name!: string;
  level?: number;
  hpCurrent?: number;

  class?: {
    id: number;
    name: string;
    damageDice: number;
    baseLoad: number;
  };

  appearance?: string[];

  stats?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}
