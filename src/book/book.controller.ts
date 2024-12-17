import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.createBook(createBookDto);
  }

  @Get()
  async getAllBooks() {
    return await this.bookService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return await this.bookService.getBookById(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    return await this.bookService.deleteBook(id);
  }
}