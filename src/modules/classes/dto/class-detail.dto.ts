export class ClassDetailDto {
  id!: number;
  name!: string;
  description?: string;
  appearance?: string;
  hitPoints!: number;
  baseLoad!: number;

  alignments!: ClassContentResponseDto[];
  races!: ClassContentResponseDto[];
  equipment!: ClassContentResponseDto[];
  initialMoves!: ClassContentResponseDto[];
  advancedMoves!: ClassContentResponseDto[];
}

export class ClassContentResponseDto {
  id!: number;
  title!: string;
  content!: string | null;
  type!: string;
  moveType!: string | null;
  levelRequired!: number | null;
  metadata!: string | null;
  isActive!: boolean | null;
  sortOrder!: number | null;
  equipmentId!: number | null;
  contentElements!: ClassContentElementResponseDto[];
}

export class ClassContentElementResponseDto {
  id!: number;
  type!: string;
  label!: string;
  code!: string | null;
  minSelect!: number | null;
  maxSelect!: number | null;
  metadata!: string | null;
  sortOrder!: number | null;
  options!: ClassContentElementOptionResponseDto[];
}

export class ClassContentElementOptionResponseDto {
  id!: number;
  label!: string;
  value!: string | null;
  sortOrder!: number | null;
}
