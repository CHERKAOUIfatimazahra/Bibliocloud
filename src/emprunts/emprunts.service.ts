import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/dynamodb.config';
import { CreateEmpruntDto } from './dto/create-emprunts.dto';
import { UpdateEmpruntDto } from './dto/update-emprunts.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmpruntsService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(EmpruntsService.name);

  constructor() {
    this.docClient = getDynamoDBClient();
  }

  async createEmprunt(createEmpruntDto: CreateEmpruntDto) {
    const item = {
      id: uuidv4(),
      ...createEmpruntDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.EMPRUNTS_TABLE_NAME,
      Item: item,
    };

    await this.docClient.send(new PutCommand(params));
    return item;
  }

  async updateEmprunt(id: string, updateEmpruntDto: UpdateEmpruntDto) {
    const existingEmprunt = await this.getEmpruntById(id);

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
      TableName: process.env.EMPRUNTS_TABLE_NAME,
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
  }

  async getEmpruntById(id: string) {
    const params = {
      TableName: process.env.EMPRUNTS_TABLE_NAME,
      Key: { id },
    };

    const response = await this.docClient.send(new GetCommand(params));

    if (!response.Item) {
      throw new NotFoundException(`Emprunt with ID ${id} not found`);
    }

    return response.Item;
  }

  async deleteEmprunt(id: string) {
    await this.getEmpruntById(id);

    const params = {
      TableName: process.env.EMPRUNTS_TABLE_NAME,
      Key: { id },
    };

    await this.docClient.send(new DeleteCommand(params));
    return { message: `Emprunt with ID ${id} deleted successfully` };
  }

  async getAllEmprunts() {
    const params = {
      TableName: process.env.EMPRUNTS_TABLE_NAME,
    };

    const response = await this.docClient.send(new ScanCommand(params));
    return response.Items || [];
  }
}
