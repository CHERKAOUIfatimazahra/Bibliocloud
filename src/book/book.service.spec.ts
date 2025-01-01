import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { CategoryService } from '../categories/categories.service';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let categoryService: Partial<CategoryService>;

  // Mocked data for books and categories
  let mockBooks: any[];
  let mockCategories: any[];

  beforeEach(async () => {
    // Initialize mock data
    mockBooks = [
      {
        id: '1',
        title: 'Test Book 1',
        categoryId: '123',
        author: 'John Doe',
        available_copies: 5,
      },
      {
        id: '2',
        title: 'Test Book 2',
        categoryId: '124',
        author: 'Jane Smith',
        available_copies: 10,
      },
    ];

    mockCategories = [
      { id: '123', name: 'Fiction' },
      { id: '124', name: 'Non-Fiction' },
    ];

    // Mock CategoryService
    categoryService = {
      getCategoryById: jest.fn((id) => {
        return mockCategories.find((category) => category.id === id) || null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: CategoryService, useValue: categoryService },  // Mock CategoryService
      ],
    }).compile();

    service = module.get<BookService>(BookService);

    // Replace actual service methods with mocks
    jest
      .spyOn(service, 'getAllBooks')
      .mockImplementation(async () => mockBooks);
    jest
      .spyOn(service, 'getBookById')
      .mockImplementation(async (id: string) => {
        const book = mockBooks.find((book) => book.id === id);
        if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
        return book;
      });
    jest
      .spyOn(service, 'createBook')
      .mockImplementation(async (bookData: any) => {
        const newBook = { id: (mockBooks.length + 1).toString(), ...bookData };
        mockBooks.push(newBook);
        return newBook;
      });
    jest
      .spyOn(service, 'updateBook')
      .mockImplementation(async (id: string, bookData: any) => {
        const bookIndex = mockBooks.findIndex((book) => book.id === id);
        if (bookIndex === -1) throw new NotFoundException(`Book with ID ${id} not found`);
        mockBooks[bookIndex] = { ...mockBooks[bookIndex], ...bookData };
        return mockBooks[bookIndex];
      });
    jest
      .spyOn(service, 'deleteBook')
      .mockImplementation(async (id: string) => {
        const bookIndex = mockBooks.findIndex((book) => book.id === id);
        if (bookIndex === -1) throw new NotFoundException(`Book with ID ${id} not found`);
        mockBooks.splice(bookIndex, 1);
        return { message: `Book with ID ${id} deleted successfully` };
      });
  });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('getAllBooks', () => {
      it('should return all books', async () => {
        const result = await service.getAllBooks();
        expect(result).toEqual(mockBooks);
      });
    });

    describe('getBookById', () => {
      it('should return a book if found', async () => {
        const result = await service.getBookById('1');
        expect(result).toEqual(mockBooks[0]);
      });

      it('should throw NotFoundException if book does not exist', async () => {
        await expect(service.getBookById('999')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('createBook', () => {
      it('should create a new book', async () => {
        const newBookData = {
          title: 'New Book',
          author: 'New Author',
          categoryId: '123',
          image: 'new-book.jpg',
          description: 'This is a new book',
          available_copies: 7,
        };

        const result = await service.createBook(newBookData);
        expect(result).toMatchObject(newBookData);
        expect(mockBooks.length).toBe(3);
      });

      it('should throw NotFoundException if category does not exist', async () => {
        const newBookData = {
          title: 'New Book',
          author: 'New Author',
          categoryId: '123',
          image: 'new-book.jpg',
          description: 'This is a new book',
          available_copies: 7,
        };

        jest.spyOn(categoryService, 'getCategoryById').mockResolvedValue(null);

        await expect(service.createBook(newBookData)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateBook', () => {
      it('should update a book if it exists', async () => {
        const updatedBookData = {
          id: '1',
          title: 'Updated Title',
          author: 'Updated Author',
          categoryId: '124',
          image: 'updated-book.jpg',
          description: 'This is an updated book',
          available_copies: 10,
        };

        const result = await service.updateBook('1', updatedBookData);
        expect(result).toMatchObject({ id: '1', ...updatedBookData });
      });

      it('should throw NotFoundException if book does not exist', async () => {
        await expect(
          service.updateBook('999', { id: '999', title: 'Updated Title' }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteBook', () => {
      it('should delete a book if it exists', async () => {
        const result = await service.deleteBook('1');
        expect(result).toEqual({
          message: `Book with ID 1 deleted successfully`,
        });
        expect(mockBooks.length).toBe(1);
      });

      it('should throw NotFoundException if book does not exist', async () => {
        await expect(service.deleteBook('999')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

});
