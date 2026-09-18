
export class ClassResponseDto {
  id!: number;
  name!: string;

  constructor(partial: Partial<ClassResponseDto>) {
    Object.assign(this, partial);
  }
}