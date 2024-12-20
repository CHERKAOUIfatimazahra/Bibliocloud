import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/dynamodb.config';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoryService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(CategoryService.name);

  constructor() {
    this.docClient = getDynamoDBClient();
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const item = {
        id: uuidv4(),
        ...createCategoryDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const params = {
        TableName: process.env.CATEGORIES_TABLE_NAME,
        Item: item,
      };

      await this.docClient.send(new PutCommand(params));
      return item;
    } catch (error) {
      this.logger.error('Error creating category', error);
      throw new Error('Failed to create category');
    }
  }

  async getCategoryById(id: string) {
    try {
      const params = {
        TableName: process.env.CATEGORIES_TABLE_NAME,
        Key: { id },
      };

      const response = await this.docClient.send(new GetCommand(params));

      if (!response.Item) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return response.Item;
    } catch (error) {
      this.logger.error(`Error fetching category with ID ${id}`, error);
      throw error;
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      // Verify the category exists
      await this.getCategoryById(id);

      const { name, description, ...otherFields } = updateCategoryDto;

      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.entries({ name, description, ...otherFields }).forEach(
        ([key, value], index) => {
          if (value !== undefined) {
            const placeholder = `#field${index}`;
            const valuePlaceholder = `:value${index}`;
            updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
            expressionAttributeNames[placeholder] = key;
            expressionAttributeValues[valuePlaceholder] = value;
          }
        },
      );

      const params = {
        TableName: process.env.CATEGORIES_TABLE_NAME,
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
      this.logger.error(`Error updating category with ID ${id}`, error);
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      // Verify the category exists
      await this.getCategoryById(id);

      const params = {
        TableName: process.env.CATEGORIES_TABLE_NAME,
        Key: { id },
      };

      await this.docClient.send(new DeleteCommand(params));
      return { message: `Category with ID ${id} deleted successfully` };
    } catch (error) {
      this.logger.error(`Error deleting category with ID ${id}`, error);
      throw error;
    }
  }

  async getAllCategories() {
    try {
      const params = {
        TableName: process.env.CATEGORIES_TABLE_NAME,
      };

      const response = await this.docClient.send(new ScanCommand(params));
      return response.Items || [];
    } catch (error) {
      this.logger.error('Error fetching all categories', error);
      throw error;
    }
  }
}
