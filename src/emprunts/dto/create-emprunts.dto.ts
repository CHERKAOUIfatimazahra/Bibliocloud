import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateEmpruntDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  bookId: string;

  @IsNotEmpty()
  @IsDateString()
  loanDate: string;

  @IsDateString()
  returnDate?: string;
}
