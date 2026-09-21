export class SpellResponseDto {
  id!: number;
  name!: string;
  spellLevel!: number;
  description!: string | null;
  metadata!: string | null;
  isActive!: boolean | null;
  sortOrder!: number | null;
}
