import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { MovesService } from './moves.service';
import { CreateMoveDto } from './dto/create-move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { PaginationDto } from 'src/common/Dto/pagination.dto';
import { MovesFiltersDto } from './dto/filters.dto';

@Controller('moves')
export class MovesController {
  private readonly logger = new Logger(MovesController.name);
  constructor(private readonly movesService: MovesService) {}

  @Post()
  create(@Body() createMoveDto: CreateMoveDto) {

    return this.movesService.create(createMoveDto);
  }

  @Get()
  findAll(@Query() query: MovesFiltersDto) {
    this.logger.log("GET ALL","[QUERY] [ ACCOUNT ]=> "+query.account);

    return this.movesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMoveDto: UpdateMoveDto) {
    return this.movesService.update(+id, updateMoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movesService.remove(+id);
  }
}
