import {
  ClassContentElementOptionResponseDto,
  ClassContentElementResponseDto,
  ClassContentResponseDto,
  ClassDetailDto,
} from '../dto/class-detail.dto';

type ClassDetailModel = {
  id: number;
  name: string;
  description: string | null;
  appearance: string | null;
  hitPoints: number;
  baseLoad: number;
  contents: Array<{
    id: number;
    type: string;
    title: string;
    content: string | null;
    moveType: string | null;
    levelRequired: number | null;
    metadata: string | null;
    isActive: boolean | null;
    sortOrder: number | null;
    equipmentId: number | null;
    contentElements: Array<{
      id: number;
      type: string;
      label: string;
      code: string | null;
      min_select: number | null;
      max_select: number | null;
      metadata: string | null;
      sortOrder: number | null;
      contentElementOptions: Array<{
        id: number;
        label: string;
        value: string | null;
        sortOrder: number | null;
      }>;
    }>;
  }>;
};

export class ClassMapper {
  static toDetail(model: ClassDetailModel): ClassDetailDto {
    const dto = new ClassDetailDto();
    dto.id = model.id;
    dto.name = model.name;
    dto.description = model.description ?? '';
    dto.appearance = model.appearance ?? '';
    dto.hitPoints = model.hitPoints;
    dto.baseLoad = model.baseLoad;
    dto.alignments = [];
    dto.races = [];
    dto.equipment = [];
    dto.initialMoves = [];
    dto.advancedMoves = [];

    for (const content of model.contents) {
      const mappedContent = this.toContent(content);
      switch (content.type) {
        case 'ALIGNMENT':
          dto.alignments.push(mappedContent);
          break;
        case 'RACE':
          dto.races.push(mappedContent);
          break;
        case 'EQUIPMENT':
          dto.equipment.push(mappedContent);
          break;
        case 'MOVE':
          if (content.moveType === 'INITIAL')
            dto.initialMoves.push(mappedContent);
          if (content.moveType === 'ADVANCED')
            dto.advancedMoves.push(mappedContent);
          break;
      }
    }

    return dto;
  }

  private static toContent(
    content: ClassDetailModel['contents'][number],
  ): ClassContentResponseDto {
    return {
      id: content.id,
      title: content.title,
      content: content.content,
      type: content.type,
      moveType: content.moveType,
      levelRequired: content.levelRequired,
      metadata: content.metadata,
      isActive: content.isActive,
      sortOrder: content.sortOrder,
      equipmentId: content.equipmentId,
      contentElements: content.contentElements.map(
        (element) =>
          ({
            id: element.id,
            type: element.type,
            label: element.label,
            code: element.code,
            minSelect: element.min_select,
            maxSelect: element.max_select,
            metadata: element.metadata,
            sortOrder: element.sortOrder,
            options: element.contentElementOptions.map(
              (option): ClassContentElementOptionResponseDto => ({
                id: option.id,
                label: option.label,
                value: option.value,
                sortOrder: option.sortOrder,
              }),
            ),
          }) satisfies ClassContentElementResponseDto,
      ),
    };
  }
}
