import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmpruntsService } from './emprunts.service';
import { CreateEmpruntDto } from './dto/create-emprunts.dto';
import { UpdateEmpruntDto } from './dto/update-emprunts.dto';

@Controller('emprunts')
export class EmpruntsController {
  constructor(private readonly empruntsService: EmpruntsService) {}

  @Post()
  create(@Body() createEmpruntDto: CreateEmpruntDto) {
    return this.empruntsService.createEmprunt(createEmpruntDto);
  }

  @Get()
  findAll() {
    return this.empruntsService.getAllEmprunts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empruntsService.getEmpruntById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpruntDto: UpdateEmpruntDto) {
    return this.empruntsService.updateEmprunt(id, updateEmpruntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empruntsService.deleteEmprunt(id);
  }
}
