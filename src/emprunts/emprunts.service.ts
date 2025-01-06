import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/dynamoDB.config';
import { CreateEmpruntDto } from './dto/create-emprunts.dto';
import { UpdateEmpruntDto } from './dto/update-emprunts.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmpruntsService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(EmpruntsService.name);
  private readonly tableName = process.env.EMPRUNTS_TABLE_NAME;

  constructor() {
    this.docClient = getDynamoDBClient();
    if (!this.tableName) {
      throw new Error(
        'EMPRUNTS_TABLE_NAME environment variable is not defined',
      );
    }
  }

  async getEmpruntsByUserId(userId: string) {
    try {
      const params = {
        TableName: this.tableName,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      };

      const response = await this.docClient.send(new ScanCommand(params));

      if (!response.Items || response.Items.length === 0) {
        return []; // Return empty array if no emprunts found
      }

      // Sort emprunts by createdAt date (most recent first)
      return response.Items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      this.logger.error(
        `Failed to get emprunts for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createEmprunt(createEmpruntDto: CreateEmpruntDto) {
    try {
      // Check if book is already borrowed
      const params = {
        TableName: this.tableName,
        FilterExpression: 'bookId = :bookId',
        ExpressionAttributeValues: {
          ':bookId': createEmpruntDto.bookId,
        },
      };

      const scanCommand = new ScanCommand(params);
      const response = await this.docClient.send(scanCommand);

      if (response.Items && response.Items.length > 0) {
        throw new ConflictException('Le livre est déjà emprunté');
      }

      // Date validation
      const dateEmprunt = new Date(createEmpruntDto.dateEmprunt);
      const dateRetour = new Date(createEmpruntDto.dateRetour);
      const currentDate = new Date();

      if (dateEmprunt < currentDate) {
        throw new BadRequestException(
          "La date d'emprunt ne peut pas être dans le passé",
        );
      }

      const diff = dateRetour.getTime() - dateEmprunt.getTime();
      const diffDays = diff / (1000 * 3600 * 24);

      if (diffDays > 15) {
        throw new BadRequestException(
          'La date de retour ne doit pas dépasser 15 jours',
        );
      }

      // Create the loan
      const emprunt = {
        id: uuidv4(),
        ...createEmpruntDto,
        createdAt: currentDate.toISOString(),
        updatedAt: currentDate.toISOString(),
      };

      const putParams = {
        TableName: this.tableName,
        Item: emprunt,
      };

      await this.docClient.send(new PutCommand(putParams));
      return emprunt;
    } catch (error) {
      this.logger.error(
        `Failed to create emprunt: ${error.message}`,
        error.stack,
      );
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to create emprunt: ${error.message}`);
    }
  }

  async getEmpruntById(id: string) {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id },
      };

      const response = await this.docClient.send(new GetCommand(params));

      if (!response.Item) {
        throw new NotFoundException(`Emprunt with ID ${id} not found`);
      }

      return response.Item;
    } catch (error) {
      this.logger.error(`Failed to get emprunt: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAllEmprunts() {
    try {
      const params = {
        TableName: this.tableName,
      };

      const response = await this.docClient.send(new ScanCommand(params));
      return response.Items || [];
    } catch (error) {
      this.logger.error(
        `Failed to get all emprunts: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateEmprunt(id: string, updateEmpruntDto: UpdateEmpruntDto) {
    try {
      await this.getEmpruntById(id);

      const updateExpressions = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.entries(updateEmpruntDto).forEach(([key, value], index) => {
        if (value !== undefined) {
          const placeholder = `#field${index}`;
          const valuePlaceholder = `:value${index}`;
          updateExpressions.push(`${placeholder} = ${valuePlaceholder}`);
          expressionAttributeNames[placeholder] = key;
          expressionAttributeValues[valuePlaceholder] = value;
        }
      });

      const params = {
        TableName: this.tableName,
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
      this.logger.error(
        `Failed to update emprunt: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteEmprunt(id: string) {
    try {
      await this.getEmpruntById(id);

      const params = {
        TableName: this.tableName,
        Key: { id },
      };

      await this.docClient.send(new DeleteCommand(params));
      return { message: `Emprunt with ID ${id} deleted successfully` };
    } catch (error) {
      this.logger.error(
        `Failed to delete emprunt: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
