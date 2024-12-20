import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  categoryId: string;

  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  available_copies: number;
}
