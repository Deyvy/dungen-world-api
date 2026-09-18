import { MoveDetailsDto } from '../dto/move-details.dto';
import { MoveResponseDto } from '../dto/move-response.dto';

export class MoveMapper {
  static toResponse(movement: any): MoveResponseDto {
    return {
      id: movement.id,
      title: movement.title,
      levelRequired: movement.levelRequired,
      content: movement.content,
    };
  }

  static toSummary(move: any): MoveDetailsDto {
    return {
      id: move.id,
      title: move.title,
      type: move.type,
      elements: move.contentElements.map((element) => ({
        id: element.id,
        type: element.type,
        label: element.label,
        code: element.code,
        minSelect: element.min_select,
        maxSelect: element.max_select,
        sortOrder: element.sortOrder,
        options: element.contentElementOptions.map(
          (option) => ({
            id: option.id,
            label: option.label,
            value: option.value,
            sortOrder: option.sortOrder,
          }),
        ),
      })),
    };
  }
}