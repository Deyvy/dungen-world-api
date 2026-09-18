import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { SelectRaceDto } from './dto/select-race.dto';
import { SelectAlignmentDto } from './dto/select-alignment.dto';
import { SelectEquipmentDto } from './dto/select-equipment.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { LevelUpDto } from './dto/level-up.dto';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.characterService.create(createCharacterDto);
  }

  @Get()
  findAll() {
    return this.characterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.characterService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.characterService.remove(+id);
  }

  @Post(':id/races')
  selectRace(@Param('id', ParseIntPipe) id: number, @Body() selectRaceDto: SelectRaceDto) {
    return this.characterService.selectRace(id, selectRaceDto);
  }

  @Post(':id/alignments')
  selectAlignment(@Param('id', ParseIntPipe) id: number, @Body() selectAlignmentDto: SelectAlignmentDto) {
    return this.characterService.selectAlignment(id, selectAlignmentDto);
  }

  @Post(':id/equipment')
  selectEquipment(@Param('id', ParseIntPipe) id: number, @Body() selectEquipmentDto: SelectEquipmentDto) {
    return this.characterService.selectEquipment(id, selectEquipmentDto);
  }

  @Get(':id/moves/:moveId')
  getCharacterMove(@Param('id', ParseIntPipe) id: number, @Param('moveId', ParseIntPipe) moveId: number) {
    return this.characterService.getCharacterMove(id, moveId);
  }

  @Get(':id/moves/available')
  getAvailableMoves(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAvailableMoves(id);
  }

  @Post(':id/moves/:contentId')
  selectMove(@Param('id', ParseIntPipe) id: number, @Param('contentId', ParseIntPipe) contentId: number) {
    return this.characterService.selectMove(id, { contentId });
  }

  @Put(':id/moves/:contentId')
  updateMove(@Param('id', ParseIntPipe) characterId: number, @Param('contentId', ParseIntPipe) contentId: number, @Body() updateMoveDto: UpdateMoveDto) {
    return this.characterService.updateMove(characterId, contentId, updateMoveDto);
  }

  @Get(':id/spells/available')
  getAvailableSpells(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAvailableSpells(id);
  }

  @Get(':id/spells')
  getCharacterSpells(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getCharacterSpells(id);
  }

  @Post(':id/spells')
  addSpell(@Param('id', ParseIntPipe) id: number, @Body() spellIds: number[]) {
    return this.characterService.addSpells(id, spellIds);
  }

  @Delete(':id/spells/:spellId')
  removeSpell(@Param('id', ParseIntPipe) id: number, @Param('spellId', ParseIntPipe) spellId: number) {
    return this.characterService.removeSpell(id, spellId);
  }

  @Post(':id/level-up')
  levelUp(@Param('id', ParseIntPipe) id: number, @Body() levelUpDto: LevelUpDto) {
    return this.characterService.levelUp(id, levelUpDto);
  }

  @Patch(':id/heal-or-damage')
  healOrDamage(@Param('id', ParseIntPipe) id: number, @Body('hpChange', ParseIntPipe) hpChange: number) {
    return this.characterService.healOrDamage(id, hpChange);
  }
}
