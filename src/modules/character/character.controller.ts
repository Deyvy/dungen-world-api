import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { SelectRaceDto } from './dto/select-race.dto';
import { SelectAlignmentDto } from './dto/select-alignment.dto';
import { SelectEquipmentDto } from './dto/select-equipment.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { LevelUpDto } from './dto/level-up.dto';
import { AddEquipmentDto } from './dto/add-equipment.dto';
import { CreateBondDto } from './dto/create-bond.dto';
import { UpdateBondDto } from './dto/update-bond.dto';

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

  @Get(':id/appearance')
  getAppearance(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAppearance(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.characterService.update(+id, updateCharacterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.remove(id);
  }

  @Post(':id/races')
  selectRace(
    @Param('id', ParseIntPipe) id: number,
    @Body() selectRaceDto: SelectRaceDto,
  ) {
    return this.characterService.selectRace(id, selectRaceDto);
  }

  @Get(':id/races/available')
  getAvailableRaces(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAvailableRaces(id);
  }

  @Get(':id/race')
  getCharacterRace(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getCharacterRace(id);
  }

  @Post(':id/alignments')
  selectAlignment(
    @Param('id', ParseIntPipe) id: number,
    @Body() selectAlignmentDto: SelectAlignmentDto,
  ) {
    return this.characterService.selectAlignment(id, selectAlignmentDto);
  }

  @Get(':id/alignments/available')
  getAvailableAlignments(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAvailableAlignments(id);
  }

  @Get(':id/alignment')
  getCharacterAlignment(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getCharacterAlignment(id);
  }

  @Post(':id/equipment')
  selectEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Body() selectEquipmentDto: SelectEquipmentDto,
  ) {
    return this.characterService.selectEquipment(id, selectEquipmentDto);
  }

  @Get(':id/equipment/available')
  getAvailableEquipment(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAvailableEquipment(id);
  }

  @Get(':id/equipment')
  getCharacterEquipment(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getCharacterEquipment(id);
  }

  @Post(':id/equipment/:equipmentId')
  addEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
    @Body() addEquipmentDto: AddEquipmentDto,
  ) {
    return this.characterService.addEquipment(id, equipmentId, addEquipmentDto);
  }

  @Delete(':id/equipment/:equipmentId')
  removeEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
  ) {
    return this.characterService.removeEquipment(id, equipmentId);
  }

  @Post(':id/equipment/:equipmentId/use')
  useEquipment(
    @Param('id', ParseIntPipe) id: number,
    @Param('equipmentId', ParseIntPipe) equipmentId: number,
  ) {
    return this.characterService.useEquipment(id, equipmentId);
  }

  @Get(':id/moves/:moveId')
  getCharacterMove(
    @Param('id', ParseIntPipe) id: number,
    @Param('moveId', ParseIntPipe) moveId: number,
  ) {
    return this.characterService.getCharacterMove(id, moveId);
  }

  @Get(':id/moves/available')
  getAvailableMoves(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getAvailableMoves(id);
  }

  @Post(':id/moves/:contentId')
  selectMove(
    @Param('id', ParseIntPipe) id: number,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return this.characterService.selectMove(id, { contentId });
  }

  @Put(':id/moves/:contentId')
  updateMove(
    @Param('id', ParseIntPipe) characterId: number,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() updateMoveDto: UpdateMoveDto,
  ) {
    return this.characterService.updateMove(
      characterId,
      contentId,
      updateMoveDto,
    );
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
  removeSpell(
    @Param('id', ParseIntPipe) id: number,
    @Param('spellId', ParseIntPipe) spellId: number,
  ) {
    return this.characterService.removeSpell(id, spellId);
  }

  @Get(':id/bonds')
  getCharacterBonds(@Param('id', ParseIntPipe) id: number) {
    return this.characterService.getCharacterBonds(id);
  }

  @Post(':id/bonds')
  createBond(
    @Param('id', ParseIntPipe) id: number,
    @Body() createBondDto: CreateBondDto,
  ) {
    return this.characterService.createBond(id, createBondDto);
  }

  @Patch(':id/bonds/:bondId')
  updateBond(
    @Param('id', ParseIntPipe) id: number,
    @Param('bondId', ParseIntPipe) bondId: number,
    @Body() updateBondDto: UpdateBondDto,
  ) {
    return this.characterService.updateBond(id, bondId, updateBondDto);
  }

  @Delete(':id/bonds/:bondId')
  deleteBond(
    @Param('id', ParseIntPipe) id: number,
    @Param('bondId', ParseIntPipe) bondId: number,
  ) {
    return this.characterService.deleteBond(id, bondId);
  }

  @Post(':id/level-up')
  levelUp(
    @Param('id', ParseIntPipe) id: number,
    @Body() levelUpDto: LevelUpDto,
  ) {
    return this.characterService.levelUp(id, levelUpDto);
  }

  @Patch(':id/heal-or-damage')
  healOrDamage(
    @Param('id', ParseIntPipe) id: number,
    @Body('hpChange', ParseIntPipe) hpChange: number,
  ) {
    return this.characterService.healOrDamage(id, hpChange);
  }
}
