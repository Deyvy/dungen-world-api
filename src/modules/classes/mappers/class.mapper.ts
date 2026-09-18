import { ClassDetailDto } from '../dto/class-detail.dto';

export class ClassMapper {

  static toDetail(model: any): ClassDetailDto {

    const dto = new ClassDetailDto();

    dto.id = model.id;
    dto.name = model.name;
    dto.description = model.description ?? '';
    dto.appearance = model.appearance ?? '';
    dto.hitPoints = model.hitPoints;
    if (model.class_content.length > 0) {
        for (const content of model.class_content) {
            switch (content.type) {
                case 'ALIGNMENT':
                    dto.alignments = content;
                    break;
                case 'RACE':
                    dto.races = content;
                    break;
                case 'EQUIPMENT':
                    dto.equipment = content;
                    break;
                case 'MOVE':
                    if (content.move_type === 'INITIAL') {
                        dto.initialMoves = content;
                    } else if (content.move_type === 'ADVANCED') {
                        dto.advancedMoves = content;
                    }
                break;
                default:
                    break;
            }
        }
    }

    return dto;
  } 
}