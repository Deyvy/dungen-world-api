export class ClassResponseDto {
  id!: number;
  name!: string;
  baseLoad!: number;

  constructor(partial: Partial<ClassResponseDto>) {
    Object.assign(this, partial);
  }
}
