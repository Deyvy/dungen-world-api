export class ClassDetailDto {
  id!: number;
  name!: string;
  description?: string;
  appearance?: string;
  hitPoints!: number;

  alignments?: any[];
  races?: any[];
  equipment?: any[];
  initialMoves?: any[];
  advancedMoves?: any[];
}