export class MoveDetailsDto {
  id!: number;

  title!: string;

  type!: string;

  elements?: MoveElementDto[];
}

export class MoveElementDto {
  id!: number;
  type!: string;
  label!: string;
  code!: string | null;
  minSelect!: number | null;
  maxSelect!: number | null;
  sortOrder!: number | null;
  options!: MoveElementOptionDto[];
}

export class MoveElementOptionDto {
  id!: number;
  label!: string;
  value!: string | null;
  sortOrder!: number | null;
}
