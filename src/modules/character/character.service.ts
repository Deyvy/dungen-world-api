import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CharacterMapper } from './mappers/character.mapper';
import { SelectRaceDto } from './dto/select-race.dto';
import {
  classContentMoveType,
  classContentType,
} from '../../generated/prisma/enums';
import { SelectEquipmentDto } from './dto/select-equipment.dto';
import { MoveMapper } from './mappers/move.mapper';
import { SelectMoveDto } from './dto/select-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { LevelUpDto } from './dto/level-up.dto';
import { AddEquipmentDto } from './dto/add-equipment.dto';
import { EquipmentMapper } from '../equipment/mappers/equipment.mapper';
import { CharacterEquipmentMapper } from './mappers/character-equipment.mapper';
import { CreateBondDto } from './dto/create-bond.dto';
import { UpdateBondDto } from './dto/update-bond.dto';
import { CharacterBondMapper } from './mappers/character-bond.mapper';
import { CharacterContentMapper } from './mappers/character-content.mapper';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const playerClass = await this.prisma.classes.findUniqueOrThrow({
      where: {
        id: createCharacterDto.classId,
      },
    });

    const hpCurrent = playerClass.hitPoints + createCharacterDto.constitution;

    const result = await this.prisma.$transaction(async (tx) => {
      const character = await tx.characters.create({
        data: {
          name: createCharacterDto.name,
          class: {
            connect: {
              id: createCharacterDto.classId,
            },
          },
          level: 1,
          hpCurrent: hpCurrent,
          strength: createCharacterDto.strength,
          dexterity: createCharacterDto.dexterity,
          constitution: createCharacterDto.constitution,
          intelligence: createCharacterDto.intelligence,
          wisdom: createCharacterDto.wisdom,
          charisma: createCharacterDto.charisma,
          appearance: {
            create:
              createCharacterDto.appearance?.map((content, index) => ({
                content,
                sortOrder: index,
              })) ?? [],
          },
        },

        include: {
          class: true,
          appearance: true,
        },
      });

      await tx.characterAppearance.createMany({
        data:
          createCharacterDto.appearance?.map((content, index) => ({
            character_id: character.id,
            content,
            sortOrder: index,
          })) ?? [],
      });

      const initialMoves = await tx.classContent.findMany({
        where: {
          classId: createCharacterDto.classId,
          type: classContentType.MOVE,
          moveType: classContentMoveType.INITIAL,
          isActive: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      });

      await tx.characterContent.createMany({
        data: initialMoves.map((move) => ({
          characterId: character.id,
          contentId: move.id,
        })),
      });

      return await tx.characters.findUnique({
        where: {
          id: character.id,
        },
        include: {
          class: true,
          appearance: true,
          content: {
            include: {
              classContent: true,
            },
          },
        },
      });
    });

    return CharacterMapper.toResponse(result);
  }

  async findAll() {
    const characters = await this.prisma.characters.findMany({
      include: {
        class: true,
        appearance: true,
      },
    });

    return characters.map((character) => CharacterMapper.toResponse(character));
  }

  async findOne(id: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        class: true,
        appearance: true,
      },
    });
    return CharacterMapper.toResponse(character);
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const { appearance, ...characterData } = updateCharacterDto;

    const updatedCharacter = await this.prisma.$transaction(async (tx) => {
      await tx.characters.update({
        where: {
          id,
        },
        data: characterData,
      });

      if (appearance !== undefined) {
        await tx.characterAppearance.deleteMany({
          where: {
            character_id: id,
          },
        });

        await tx.characterAppearance.createMany({
          data: appearance.map((content, index) => ({
            character_id: id,
            content,
            sortOrder: index,
          })),
        });
      }

      return tx.characters.findUnique({
        where: {
          id,
        },
        include: {
          class: true,
          appearance: true,
        },
      });
    });

    return CharacterMapper.toResponse(updatedCharacter);
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }

  async selectRace(characterId: number, selectRaceDto: SelectRaceDto) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const existingRace = await this.prisma.characterContent.findMany({
      where: {
        characterId,
        classContent: {
          type: classContentType.RACE,
        },
      },
    });

    if (existingRace.length > 0) {
      throw new BadRequestException('Ya existe una raza para este personaje');
    }

    const classContent = await this.prisma.classContent.findUniqueOrThrow({
      where: {
        id: selectRaceDto.contentId,
        type: classContentType.RACE,
      },
    });

    if (classContent.classId !== character.classId) {
      throw new BadRequestException(
        'La raza no pertenece a la clase del personaje',
      );
    }

    await this.prisma.characterContent.create({
      data: {
        characterId: characterId,
        contentId: selectRaceDto.contentId,
      },
    });

    return this.findOne(characterId);
  }

  async getAvailableRaces(characterId: number) {
    return this.getAvailableClassContent(characterId, classContentType.RACE);
  }

  async getCharacterRace(characterId: number) {
    return this.getSelectedClassContent(characterId, classContentType.RACE);
  }

  async selectAlignment(
    characterId: number,
    selectAlignmentDto: SelectRaceDto,
  ) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const existingAlignment = await this.prisma.characterContent.findMany({
      where: {
        characterId,
        classContent: {
          type: classContentType.ALIGNMENT,
        },
      },
    });

    if (existingAlignment.length > 0) {
      throw new BadRequestException(
        'Ya existe un alineamiento para este personaje',
      );
    }

    const classContent = await this.prisma.classContent.findUniqueOrThrow({
      where: {
        id: selectAlignmentDto.contentId,
        type: classContentType.ALIGNMENT,
      },
    });

    if (classContent.classId !== character.classId) {
      throw new BadRequestException(
        'El alineamiento no pertenece a la clase del personaje',
      );
    }

    await this.prisma.characterContent.create({
      data: {
        characterId: characterId,
        contentId: selectAlignmentDto.contentId,
      },
    });

    return this.findOne(characterId);
  }

  async getAvailableAlignments(characterId: number) {
    return this.getAvailableClassContent(
      characterId,
      classContentType.ALIGNMENT,
    );
  }

  async getCharacterAlignment(characterId: number) {
    return this.getSelectedClassContent(
      characterId,
      classContentType.ALIGNMENT,
    );
  }

  private async getAvailableClassContent(
    characterId: number,
    type: classContentType,
  ) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
      select: { classId: true },
    });

    const content = await this.prisma.classContent.findMany({
      where: {
        classId: character.classId,
        type,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    return content.map((item) => CharacterContentMapper.toResponse(item));
  }

  private async getSelectedClassContent(
    characterId: number,
    type: classContentType,
  ) {
    await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
      select: { id: true },
    });

    const selected = await this.prisma.characterContent.findFirst({
      where: {
        characterId,
        classContent: { type },
      },
      select: {
        classContent: {
          select: {
            id: true,
            title: true,
            content: true,
            sortOrder: true,
          },
        },
      },
    });

    return selected
      ? CharacterContentMapper.toResponse(selected.classContent)
      : null;
  }

  async selectEquipment(
    characterId: number,
    selectEquipmentDto: SelectEquipmentDto,
  ) {
    await this.prisma.$transaction(async (tx) => {
      const character = await tx.characters.findUniqueOrThrow({
        where: { id: characterId },
      });
      const equipment = await tx.equipment.findMany({
        where: {
          id: { in: selectEquipmentDto.equipmentIds },
          isActive: true,
          classContent: {
            some: {
              classId: character.classId,
              type: classContentType.EQUIPMENT,
              isActive: true,
            },
          },
        },
      });

      if (equipment.length !== selectEquipmentDto.equipmentIds.length) {
        throw new NotFoundException(
          'Uno o más elementos de equipo no existen o no pertenecen a la clase del personaje',
        );
      }

      await tx.characterEquipment.deleteMany({ where: { characterId } });
      await tx.characterEquipment.createMany({
        data: equipment.map((item) => ({
          characterId,
          equipmentId: item.id,
          quantity: 1,
          usesRemaining: EquipmentMapper.toMetadata(item.metadata).usesPerUnit,
        })),
      });
    });

    return this.getCharacterEquipment(characterId);
  }

  async getAvailableEquipment(characterId: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
    });
    const options = await this.prisma.classContent.findMany({
      where: {
        classId: character.classId,
        type: classContentType.EQUIPMENT,
        isActive: true,
        equipmentId: { not: null },
        equipment: { is: { isActive: true } },
      },
      include: { equipment: true },
      orderBy: { sortOrder: 'asc' },
    });

    return options.flatMap((option) =>
      option.equipment
        ? [
            CharacterEquipmentMapper.toClassOption({
              ...option.equipment,
              classContentId: option.id,
              title: option.title,
              content: option.content,
            }),
          ]
        : [],
    );
  }

  async getCharacterEquipment(characterId: number) {
    await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
    });
    const rows = await this.prisma.characterEquipment.findMany({
      where: { characterId },
      include: { equipment: true },
      orderBy: { equipment: { name: 'asc' } },
    });
    return rows.map((row) => CharacterEquipmentMapper.toCharacterResponse(row));
  }

  async addEquipment(
    characterId: number,
    equipmentId: number,
    dto: AddEquipmentDto,
  ) {
    await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
    });
    const equipment = await this.prisma.equipment.findFirstOrThrow({
      where: { id: equipmentId, isActive: true },
    });
    const usesPerUnit = EquipmentMapper.toMetadata(
      equipment.metadata,
    ).usesPerUnit;

    await this.prisma.characterEquipment.upsert({
      where: { characterId_equipmentId: { characterId, equipmentId } },
      create: {
        characterId,
        equipmentId,
        quantity: dto.quantity,
        usesRemaining: usesPerUnit,
      },
      update: { quantity: { increment: dto.quantity } },
    });

    return this.getCharacterEquipment(characterId);
  }

  async removeEquipment(characterId: number, equipmentId: number) {
    await this.prisma.$transaction(async (tx) => {
      const row = await tx.characterEquipment.findUniqueOrThrow({
        where: { characterId_equipmentId: { characterId, equipmentId } },
      });

      if (row.quantity > 1) {
        await tx.characterEquipment.update({
          where: { characterId_equipmentId: { characterId, equipmentId } },
          data: { quantity: { decrement: 1 } },
        });
        return;
      }

      await tx.characterEquipment.delete({
        where: { characterId_equipmentId: { characterId, equipmentId } },
      });
    });
    return this.getCharacterEquipment(characterId);
  }

  async useEquipment(characterId: number, equipmentId: number) {
    const result = await this.prisma.$transaction(async (tx) => {
      const row = await tx.characterEquipment.findUniqueOrThrow({
        where: { characterId_equipmentId: { characterId, equipmentId } },
        include: { equipment: true },
      });
      const usesPerUnit = EquipmentMapper.toMetadata(
        row.equipment.metadata,
      ).usesPerUnit;

      if (!usesPerUnit) {
        throw new BadRequestException('El equipo no es consumible');
      }
      if (row.usesRemaining === null || row.usesRemaining < 1) {
        throw new BadRequestException(
          'El equipo no tiene usos restantes válidos',
        );
      }

      if (row.usesRemaining > 1) {
        await tx.characterEquipment.update({
          where: { characterId_equipmentId: { characterId, equipmentId } },
          data: { usesRemaining: { decrement: 1 } },
        });
      } else if (row.quantity > 1) {
        await tx.characterEquipment.update({
          where: { characterId_equipmentId: { characterId, equipmentId } },
          data: { quantity: { decrement: 1 }, usesRemaining: usesPerUnit },
        });
      } else {
        await tx.characterEquipment.delete({
          where: { characterId_equipmentId: { characterId, equipmentId } },
        });
      }
    });

    return this.getCharacterEquipment(characterId);
  }

  async getCharacterMove(characterId: number, moveId: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const move = await this.prisma.classContent.findUniqueOrThrow({
      where: {
        id: moveId,
        type: classContentType.MOVE,
      },
      include: {
        contentElements: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            contentElementOptions: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });

    if (move.classId !== character.classId) {
      throw new BadRequestException(
        'El movimiento no pertenece a la clase del personaje',
      );
    }

    return MoveMapper.toSummary(move);
  }

  async getAvailableMoves(characterId: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const moves = await this.prisma.classContent.findMany({
      where: {
        classId: character.classId,
        type: classContentType.MOVE,
        moveType: classContentMoveType.ADVANCED,
        levelRequired: {
          lte: character.level!,
        },
        isActive: true,
        characterContent: {
          none: {
            characterId,
          },
        },
      },
      orderBy: [
        {
          levelRequired: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });

    const movesResponse = moves.map((move) => MoveMapper.toResponse(move));

    return movesResponse;
  }

  async selectMove(characterId: number, selectMoveDto: SelectMoveDto) {
    await this.prisma.$transaction(async (tx) => {
      await this.acquireMove(tx, characterId, selectMoveDto.contentId);
    });

    return this.findOne(characterId);
  }

  private async acquireMove(
    tx: Prisma.TransactionClient,
    characterId: number,
    contentId: number,
  ) {
    const character = await tx.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
    });

    const move = await tx.classContent.findUniqueOrThrow({
      where: {
        id: contentId,
      },
    });

    if (move.type !== classContentType.MOVE) {
      throw new BadRequestException(
        'El contenido seleccionado no es un movimiento',
      );
    }

    if (move.moveType !== classContentMoveType.ADVANCED) {
      throw new BadRequestException(
        'Solo se pueden adquirir movimientos avanzados',
      );
    }

    if (!move.isActive) {
      throw new BadRequestException('El movimiento no está activo');
    }

    if (move.classId !== character.classId) {
      throw new BadRequestException(
        'El movimiento no pertenece a la clase del personaje',
      );
    }

    if (move.levelRequired === null || move.levelRequired > character.level!) {
      throw new BadRequestException('El movimiento requiere niveles más altos');
    }

    const existingMove = await tx.characterContent.findUnique({
      where: {
        characterId_contentId: {
          characterId,
          contentId,
        },
      },
    });

    if (existingMove) {
      throw new BadRequestException('El personaje ya posee este movimiento');
    }

    return tx.characterContent.create({
      data: {
        characterId,
        contentId,
      },
    });
  }

  async updateMove(
    characterId: number,
    contentId: number,
    updateMoveDto: UpdateMoveDto,
  ) {
    const elementIds = updateMoveDto.elements.map(
      (element) => element.elementId,
    );
    if (new Set(elementIds).size !== elementIds.length) {
      throw new BadRequestException('No se pueden repetir elementos');
    }

    for (const element of updateMoveDto.elements) {
      if (element.optionIds === undefined) {
        continue;
      }

      if (new Set(element.optionIds).size !== element.optionIds.length) {
        throw new BadRequestException(
          `No se pueden repetir opciones en el elemento ${element.elementId}`,
        );
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const character = await tx.characters.findUniqueOrThrow({
        where: {
          id: characterId,
        },
        include: {
          class: true,
        },
      });

      const characterContent = await tx.characterContent.findUniqueOrThrow({
        where: {
          characterId_contentId: {
            characterId,
            contentId,
          },
        },
      });

      const content = await tx.classContent.findUniqueOrThrow({
        where: {
          id: contentId,
          type: classContentType.MOVE,
        },
        include: {
          contentElements: {
            include: {
              contentElementOptions: true,
            },
          },
        },
      });

      const validElementIds = new Set(
        content.contentElements.map((element) => element.id),
      );

      for (const element of updateMoveDto.elements) {
        if (!validElementIds.has(element.elementId)) {
          throw new BadRequestException(
            `El elemento ${element.elementId} no pertenece al movimiento`,
          );
        }
      }

      for (const element of updateMoveDto.elements) {
        if (element.optionIds === undefined) {
          continue;
        }

        const contentElement = content.contentElements.find(
          (item) => item.id === element.elementId,
        );

        if (!contentElement) {
          throw new BadRequestException(
            `El elemento ${element.elementId} no existe`,
          );
        }

        const validOptionIds = new Set(
          contentElement.contentElementOptions.map((option) => option.id),
        );

        for (const optionId of element.optionIds) {
          if (!validOptionIds.has(optionId)) {
            throw new BadRequestException(
              `La opción ${optionId} no pertenece al elemento ${element.elementId}`,
            );
          }
        }

        if (
          contentElement.min_select !== null &&
          element.optionIds.length < contentElement.min_select
        ) {
          throw new BadRequestException(
            `El elemento ${element.elementId} requiere al menos ${contentElement.min_select} opciones`,
          );
        }

        if (
          contentElement.max_select !== null &&
          element.optionIds.length > contentElement.max_select
        ) {
          throw new BadRequestException(
            `El elemento ${element.elementId} permite como máximo ${contentElement.max_select} opciones`,
          );
        }
      }

      for (const element of updateMoveDto.elements) {
        if (element.value !== undefined) {
          await tx.characterElementValues.deleteMany({
            where: {
              characterId,
              elementId: element.elementId,
            },
          });
        }

        if (element.optionIds !== undefined) {
          await tx.characterElementOptions.deleteMany({
            where: {
              characterId,
              elementId: element.elementId,
            },
          });
        }

        if (element.value !== undefined) {
          await tx.characterElementValues.create({
            data: {
              characterId,
              elementId: element.elementId,
              value: element.value,
            },
          });
        }

        if (element.optionIds?.length) {
          await tx.characterElementOptions.createMany({
            data: element.optionIds.map((optionId) => ({
              characterId,
              elementId: element.elementId,
              optionId,
            })),
          });
        }
      }

      const result = await tx.classContent.findUnique({
        where: {
          id: contentId,
        },
        include: {
          contentElements: {
            orderBy: {
              sortOrder: 'asc',
            },
            include: {
              contentElementOptions: {
                orderBy: {
                  sortOrder: 'asc',
                },
              },
              characterElementValues: {
                where: {
                  characterId: characterId,
                },
              },
              characterElementOptions: {
                where: {
                  characterId: characterId,
                },
              },
            },
          },
        },
      });

      return result;
    });

    return MoveMapper.toResponse(result);
  }

  async getAvailableSpells(characterId: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      select: {
        id: true,
        level: true,
        classId: true,
      },
    });

    const spellLists = await this.prisma.spellLists.findMany({
      where: {
        classId: character.classId,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const spellListIds = spellLists.map((list) => list.id);

    if (spellListIds.length === 0) {
      return [];
    }

    const spells = await this.prisma.spells.findMany({
      where: {
        spellListId: {
          in: spellListIds,
        },
        isActive: true,
        spellLevel: {
          lte: character.level!,
          gt: 0,
        },
      },
      orderBy: [
        {
          spellLevel: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
      include: {
        spellLists: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return spells;
  }

  async getCharacterSpells(characterId: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      select: {
        id: true,
        classId: true,
      },
    });

    const spellList = await this.prisma.spellLists.findFirstOrThrow({
      where: {
        classId: character.classId,
      },
      select: {
        id: true,
      },
    });

    const selectedSpells = await this.prisma.characterSpells.findMany({
      where: {
        characterId,
      },
      select: {
        spellId: true,
      },
    });

    const spells = await this.prisma.spells.findMany({
      where: {
        OR: [
          {
            id: {
              in: selectedSpells.map((spell) => spell.spellId),
            },
          },
          {
            spellListId: spellList.id,
            spellLevel: 0,
          },
        ],
      },
      orderBy: [
        {
          spellLevel: 'asc',
        },
        {
          sortOrder: 'asc',
        },
      ],
    });

    return spells;
  }

  async addSpells(characterId: number, spellIds: number[]) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const spells = await this.prisma.spells.findMany({
      where: {
        id: {
          in: spellIds,
        },
      },
      include: {
        spellLists: true,
      },
    });

    for (const spell of spells) {
      if (!spell.isActive) {
        throw new BadRequestException('El hechizo no está activo');
      }

      if (spell.spellLists.classId !== character.classId) {
        throw new BadRequestException(
          'El hechizo no pertenece a la clase del personaje',
        );
      }

      if (spell.spellLevel > character.level!) {
        throw new BadRequestException(
          'El nivel del personaje no es suficiente para usar el hechizo',
        );
      }
    }

    const spellLevelLimit = character.level! + 1;
    const spellLevel = spells.reduce((acc, spell) => acc + spell.spellLevel, 0);

    if (spellLevel > spellLevelLimit) {
      throw new BadRequestException(
        'El nivel del personaje no es suficiente para usar todos los hechizos',
      );
    }

    await this.prisma.characterSpells.deleteMany({
      where: {
        characterId,
      },
    });

    await this.prisma.characterSpells.createMany({
      data: spellIds.map((spellId) => ({
        characterId,
        spellId,
      })),
    });

    return this.getCharacterSpells(characterId);
  }

  async removeSpell(characterId: number, spellId: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const characterSpell = await this.prisma.characterSpells.findUniqueOrThrow({
      where: {
        characterId_spellId: {
          characterId,
          spellId,
        },
      },
    });

    await this.prisma.characterSpells.delete({
      where: {
        characterId_spellId: {
          characterId,
          spellId,
        },
      },
    });

    return {
      message: 'El personaje ha olvidado el hechizo',
    };
  }

  async getCharacterBonds(characterId: number) {
    await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
    });

    const bonds = await this.prisma.characterBonds.findMany({
      where: { character_id: characterId },
      orderBy: { created_at: 'asc' },
    });

    return bonds.map((bond) => CharacterBondMapper.toResponse(bond));
  }

  async createBond(characterId: number, dto: CreateBondDto) {
    await this.prisma.characters.findUniqueOrThrow({
      where: { id: characterId },
    });

    const bond = await this.prisma.characterBonds.create({
      data: {
        character_id: characterId,
        text: this.normalizeBondText(dto.text),
      },
    });

    return CharacterBondMapper.toResponse(bond);
  }

  async updateBond(characterId: number, bondId: number, dto: UpdateBondDto) {
    const existingBond = await this.prisma.characterBonds.findFirst({
      where: {
        id: bondId,
        character_id: characterId,
      },
    });

    if (!existingBond) {
      throw new NotFoundException('El bond no existe para este personaje');
    }

    const result = await this.prisma.characterBonds.updateMany({
      where: {
        id: bondId,
        character_id: characterId,
      },
      data: {
        text: this.normalizeBondText(dto?.text),
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('El bond no existe para este personaje');
    }

    const bond = await this.prisma.characterBonds.findFirstOrThrow({
      where: {
        id: bondId,
        character_id: characterId,
      },
    });

    return CharacterBondMapper.toResponse(bond);
  }

  async deleteBond(characterId: number, bondId: number) {
    const result = await this.prisma.characterBonds.deleteMany({
      where: {
        id: bondId,
        character_id: characterId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('El bond no existe para este personaje');
    }

    return {
      message: 'El bond ha sido eliminado',
    };
  }

  private normalizeBondText(text: unknown): string {
    if (typeof text !== 'string') {
      throw new BadRequestException('El texto del bond debe ser un string');
    }

    const normalizedText = text.trim();
    if (!normalizedText) {
      throw new BadRequestException('El texto del bond no puede estar vacío');
    }

    return normalizedText;
  }

  async levelUp(characterId: number, levelUpDto: LevelUpDto) {
    await this.prisma.$transaction(async (tx) => {
      const character = await tx.characters.findUniqueOrThrow({
        where: {
          id: characterId,
        },
        include: {
          class: true,
        },
      });

      const wasAtMaxHp =
        character.constitution !== null &&
        character.hpCurrent ===
          character.class.hitPoints + character.constitution;
      const hpCurrent =
        levelUpDto.stat === 'constitution' && wasAtMaxHp
          ? character.hpCurrent! + 1
          : character.hpCurrent!;

      await tx.characters.update({
        where: {
          id: characterId,
        },
        data: {
          level: character.level! + 1,
          [levelUpDto.stat]: character[levelUpDto.stat]! + 1,
          hpCurrent,
        },
      });

      await this.acquireMove(tx, characterId, levelUpDto.moveId);
    });

    return this.findOne(characterId);
  }

  async healOrDamage(characterId: number, hpChange: number) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    let hpCurrent = character.hpCurrent! - hpChange;

    if (hpCurrent < 0) {
      hpCurrent = 0;
    }

    if (character.constitution! + character.class.hitPoints < hpCurrent) {
      hpCurrent = character.constitution! + character.class.hitPoints;
    }

    await this.prisma.characters.update({
      where: {
        id: characterId,
      },
      data: {
        hpCurrent: hpCurrent,
      },
    });

    return this.findOne(characterId);
  }
}
