import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  // name unique
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  description?: string;
}
