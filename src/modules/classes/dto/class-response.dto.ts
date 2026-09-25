export class ClassResponseDto {
  id!: number;
  name!: string;
  damageDice!: number;
  baseLoad!: number;

  constructor(partial: Partial<ClassResponseDto>) {
    Object.assign(this, partial);
  }
}
