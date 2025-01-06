import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/dynamoDB.config';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CategoryService } from '../categories/categories.service';

@Injectable()
export class BookService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(BookService.name);

  constructor(private readonly categoryService: CategoryService) {
    this.docClient = getDynamoDBClient();
  }
  async createBook(createBookDto: CreateBookDto) {
    try {
      // Check if category exists before creating the book
      const category = await this.categoryService.getCategoryById(
        createBookDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createBookDto.categoryId} not found`,
        );
      }

      const item = {
        id: uuidv4(),
        ...createBookDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Item: item,
      };

      await this.docClient.send(new PutCommand(params));
      return item;
    } catch (error) {
      this.logger.error('Error creating book', error);
      throw new Error('Failed to create book');
    }
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    try {
      // Verify the book exists
      const existingBook = await this.getBookById(id);

      // If categoryId is provided, check if the category exists
      if (updateBookDto.categoryId) {
        const category = await this.categoryService.getCategoryById(
          updateBookDto.categoryId,
        );
        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateBookDto.categoryId} not found`,
          );
        }
      }

      // Prepare the update expression
      const { title, author, categoryId, description, available_copies, ...otherFields } =
        updateBookDto;

      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.entries({
        title,
        author,
        categoryId,
        description,
        available_copies,
        ...otherFields,
      }).forEach(([key, value], index) => {
        if (value !== undefined) {
          const placeholder = `#field${index}`;
          const valuePlaceholder = `:value${index}`;
          updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
          expressionAttributeNames[placeholder] = key;
          expressionAttributeValues[valuePlaceholder] = value;
        }
      });

      const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}, #updatedAt = :updatedAt`,
        ExpressionAttributeNames: {
          ...expressionAttributeNames,
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ...expressionAttributeValues,
          ':updatedAt': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW' as const,
      };

      const response = await this.docClient.send(new UpdateCommand(params));
      return response.Attributes;
    } catch (error) {
      this.logger.error(`Error updating book with ID ${id}`, error);
      throw error;
    }
  }

  async getBookById(id: string) {
    try {
      const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Key: { id },
      };

      const response = await this.docClient.send(new GetCommand(params));

      if (!response.Item) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return response.Item;
    } catch (error) {
      this.logger.error(`Error fetching book with ID ${id}`, error);
      throw error;
    }
  }

  async deleteBook(id: string) {
    try {
      // First, verify the book exists
      await this.getBookById(id);

      const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
        Key: { id },
      };

      await this.docClient.send(new DeleteCommand(params));
      return { message: `Book with ID ${id} deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting book with ID ${id}`, error);
      throw error;
    }
  }

  async getAllBooks() {
    try {
      const params = {
        TableName: process.env.BOOKS_TABLE_NAME,
      };

      const response = await this.docClient.send(new ScanCommand(params));
      return response.Items || [];
    } catch (error) {
      this.logger.error('Error fetching all books', error);
      throw error;
    }
  }
}
