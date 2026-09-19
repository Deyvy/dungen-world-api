import { CharacterContentResponseDto } from '../dto/character-content-response.dto';

export class CharacterContentMapper {
  static toResponse(content: {
    id: number;
    title: string;
    content: string | null;
    sortOrder: number | null;
  }): CharacterContentResponseDto {
    return {
      id: content.id,
      title: content.title,
      content: content.content,
      sortOrder: content.sortOrder,
    };
  }
}
