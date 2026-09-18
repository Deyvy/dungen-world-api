import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CharacterMapper } from './mappers/character.mapper';
import { SelectRaceDto } from './dto/select-race.dto';
import { classContentMoveType, classContentType } from '../../generated/prisma/enums';
import { SelectEquipmentDto } from './dto/select-equipment.dto';
import { MoveMapper } from './mappers/move.mapper';
import { SelectMoveDto } from './dto/select-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { LevelUpDto } from './dto/level-up.dto';

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
            create: createCharacterDto.appearance?.map((content, index) => ({
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
        data: createCharacterDto.appearance?.map((content, index) => ({
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
      }
    });

    const {
      appearance,
      ...characterData
    } = updateCharacterDto;

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
      throw new BadRequestException('La raza no pertenece a la clase del personaje');
    }

    await this.prisma.characterContent.create({
      data: {
        characterId: characterId,
        contentId: selectRaceDto.contentId,
      },
    });

    return this.findOne(characterId);
  }

  async selectAlignment(characterId: number, selectAlignmentDto: SelectRaceDto) {
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
      throw new BadRequestException('Ya existe un alineamiento para este personaje');
    }

    const classContent = await this.prisma.classContent.findUniqueOrThrow({
      where: {
        id: selectAlignmentDto.contentId,
        type: classContentType.ALIGNMENT,
      },
    });

    if (classContent.classId !== character.classId) {
      throw new BadRequestException('El alineamiento no pertenece a la clase del personaje');
    }

    await this.prisma.characterContent.create({
      data: {
        characterId: characterId,
        contentId: selectAlignmentDto.contentId,
      },
    });

    return this.findOne(characterId);
  }

  async selectEquipment(characterId: number, selectEquipmentDto: SelectEquipmentDto) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const equipment = await this.prisma.classContent.findMany({
      where: {
        id: {
          in: selectEquipmentDto.contentIds,
        },
        type: classContentType.EQUIPMENT,
      },
    });

    if (equipment.length !== selectEquipmentDto.contentIds.length) {
      throw new NotFoundException(
        'Uno o más elementos de equipo no existen',
      );
    }
  
    const invalidClassContent = equipment.some(
      (item) => item.classId !== character.classId,
    );

    if (invalidClassContent) {
      throw new BadRequestException(
        'Uno o más elementos de equipo no pertenecen a la clase del personaje',
      );
    }

    await this.prisma.characterContent.deleteMany({
      where: {
        characterId,
        classContent: {
          type: classContentType.EQUIPMENT,
        },
      },
    });

    await this.prisma.characterContent.createMany({
      data: selectEquipmentDto.contentIds.map((contentId) => ({
        characterId: characterId,
        contentId,
      })),
    });

    return this.findOne(characterId);
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
      throw new BadRequestException('El movimiento no pertenece a la clase del personaje');
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
      ]
    });

    const movesResponse = moves.map((move) => MoveMapper.toResponse(move));

    return movesResponse;
  }

  async selectMove(characterId: number, selectMoveDto: SelectMoveDto) {
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
        id: selectMoveDto.contentId,
        type: classContentType.MOVE,
      },
    });

    if (move.classId !== character.classId) {
      throw new BadRequestException('El movimiento no pertenece a la clase del personaje');
    }

    if (move.moveType === classContentMoveType.ADVANCED) {
      if (move.levelRequired! > character.level!) {
        throw new BadRequestException('El movimiento requiere niveles más altos');
      }
    }

    await this.prisma.characterContent.create({
      data: {
        characterId: characterId,
        contentId: selectMoveDto.contentId,
      },
    });

    return this.findOne(characterId);
  }

  async updateMove(characterId: number, contentId: number, updateMoveDto: UpdateMoveDto) {
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
              contentElementOptions: true
            },
          },
        },
      });

      const validElementIds = new Set(
        content.contentElements.map(
          (element) => element.id,
        ),
      );

      for (const element of updateMoveDto.elements) {
        if (!validElementIds.has(element.elementId)) {
          throw new BadRequestException(
            `El elemento ${element.elementId} no pertenece al movimiento`,
          );
        }
      }

      for (const element of updateMoveDto.elements) {
        if (!element.optionIds?.length) {
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
          contentElement.contentElementOptions.map(
            (option) => option.id,
          ),
        );

        for (const optionId of element.optionIds) {
          if (!validOptionIds.has(optionId)) {
            throw new BadRequestException(
              `La opción ${optionId} no pertenece al elemento ${element.elementId}`,
            );
          }
        }

        if (
        contentElement.min_select !== null && element.optionIds.length < contentElement.min_select) {
          throw new BadRequestException(
            `El elemento ${element.elementId} requiere al menos ${contentElement.min_select} opciones`,
          );
        }

        if (contentElement.max_select !== null && element.optionIds.length > contentElement.max_select) {
          throw new BadRequestException(
            `El elemento ${element.elementId} permite como máximo ${contentElement.max_select} opciones`,
          );
        }
      }

      await tx.characterElementValues.deleteMany({
        where: {
          characterId: characterId,
          elementId: {
            in: content.contentElements.map(
              (element) => element.id,
            ),
          },
        },
      });

      await tx.characterElementOptions.deleteMany({
        where: {
          characterId: characterId,
          elementId: {
            in: content.contentElements.map(
              (element) => element.id,
            ),
          },
        },
      });

      for (const element of updateMoveDto.elements) {
        if (element.value !== undefined) {
          await tx.characterElementValues.create({
            data: {
              characterId: characterId,
              elementId: element.elementId,
              value: element.value,
            },
          });
        }
      }

      for (const element of updateMoveDto.elements) {
        if (element.optionIds?.length) {
          await tx.characterElementOptions.createMany({
            data: element.optionIds.map((optionId) => ({
              characterId: characterId,
              elementId: element.elementId,
              optionId: optionId,
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
        }
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
        id: true
      },
    });

    const selectedSpells = await this.prisma.characterSpells.findMany({
      where: {
        characterId,
      },
      select: {
        spellId: true,
      }
    });
    

    const spells = await this.prisma.spells.findMany({
      where: {
        OR: [
          {
            id: {
              in: selectedSpells.map((spell) => spell.spellId)
            }
          },
          {
            spellListId: spellList.id,
            spellLevel: 0 
          }
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
          in: spellIds
        }
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
        throw new BadRequestException('El hechizo no pertenece a la clase del personaje');
      }

      if (spell.spellLevel > character.level!) {
        throw new BadRequestException('El nivel del personaje no es suficiente para usar el hechizo');
      }
    }

    const spellLevelLimit = character.level! + 1;
    const spellLevel = spells.reduce((acc, spell) => acc + spell.spellLevel, 0);

    if (spellLevel > spellLevelLimit) {
      throw new BadRequestException('El nivel del personaje no es suficiente para usar todos los hechizos');
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
        known: true,
        prepared: false,
      }))
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

  async levelUp(characterId: number, levelUpDto: LevelUpDto) {
    const character = await this.prisma.characters.findUniqueOrThrow({
      where: {
        id: characterId,
      },
      include: {
        class: true,
      },
    });

    const oldCharacter = character;

    // Recalcular el hp actual. Si está al 100%, aumenta en 1 para seguir al 100%.
    const hpCurrent = levelUpDto.stat === 'constitution' ? character.hpCurrent! + 1 : character.hpCurrent!;
    
    try {
      await this.prisma.characters.update({
        where: {
          id: characterId,
        },
        data: {
          level: character.level! + 1,
          [levelUpDto.stat]: character[levelUpDto.stat]! + 1,
          hpCurrent,
        },
      });

      await this.selectMove(characterId, { contentId: levelUpDto.moveId });
    } catch (error) {
      // Rollback manual, ya que al llamar a selectMove no tiene sentido hacer una transacción.
      await this.prisma.characters.update({
        where: {
          id: characterId,
        },
        data: {
          level: oldCharacter.level,
          [levelUpDto.stat]: oldCharacter[levelUpDto.stat],
          hpCurrent: oldCharacter.hpCurrent,
        },
      });

      throw new NotFoundException(error);
    }

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

    if((character.constitution! + character.class.hitPoints) < hpCurrent) {
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
