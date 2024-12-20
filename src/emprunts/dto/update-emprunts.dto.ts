import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpruntDto } from './create-emprunts.dto';

export class UpdateEmpruntDto extends PartialType(CreateEmpruntDto) {}
