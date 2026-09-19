import { BondResponseDto } from '../dto/bond-response.dto';

export class CharacterBondMapper {
  static toResponse(bond: {
    id: number;
    text: string;
    created_at: Date;
  }): BondResponseDto {
    return {
      id: bond.id,
      text: bond.text,
      createdAt: bond.created_at,
    };
  }
}
