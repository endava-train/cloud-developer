import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {TodoItem} from "../models/TodoItem";
import * as AWS from 'aws-sdk';
import {getLogger} from "../utils/logger";
import * as AWSXRay from 'aws-xray-sdk';

const log = getLogger();

export interface TodosAccess {
  getAll(userId: string): Promise<TodoItem[]>;
  getById(todoId: string, userId: string): Promise<TodoItem>;
  create(todoItem: TodoItem): Promise<TodoItem>;
  update(todoItem: TodoItem): Promise<TodoItem>;
  delete(userId: string, todoId: string): Promise<boolean>;
}

class TodosAccessImp implements TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable: string = process.env.TODOS_TABLE,
  ) {
  }

  async getById(userId: string, todoId: string): Promise<TodoItem> {
    const params = { todoId, userId };
    log.info(`getById params: ${JSON.stringify(params, null, 4)}`);
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: { todoId, userId },
    }).promise();

    return result.Item as TodoItem
  }

  async getAll(userId: string): Promise<TodoItem[]> {
    log.info(`getAll params: ${JSON.stringify(userId, null, 4)}`);
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise();

    const items = result.Items;
    return items as TodoItem[];
  }

  async create(todoItem: TodoItem): Promise<TodoItem> {
    log.info(`create params: ${JSON.stringify(todoItem, null, 4)}`);
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise();

    return todoItem;
  }

  async update(todoItem: TodoItem): Promise<TodoItem> {
    log.info(`updateAccess ${todoItem.todoId}`);
    const result = await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId: todoItem.todoId, userId: todoItem.userId },
      UpdateExpression: "set #nm = :name, dueDate = :dueDate, done = :done, attachmentUrl = :attachmentUrl",
      ExpressionAttributeNames: {
        '#nm': 'name',
      },
      ExpressionAttributeValues: {
        ':name': todoItem.name,
        ':dueDate': todoItem.dueDate,
        ':done': todoItem.done,
        ':attachmentUrl': todoItem.attachmentUrl,
      },
      ReturnValues: "UPDATED_NEW",
    }).promise();

    log.info("updateAccess: result" + JSON.stringify({result}, null, 4));

    return todoItem;
  }

  async delete(todoId: string, userId: string): Promise<boolean> {
    log.info(`deleteAccess todoId: ${todoId} userId: ${userId}`);
    try {
      const data = await this.docClient.delete({
        TableName: this.todosTable,
        Key: {todoId, userId},
      }).promise();
      log.info("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    } catch (err) {
      log.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      return false;
    }

    return true;
  }
}

function createDynamoDBClient() {
  const XAWS = AWSXRay.captureAWS(AWS);
  if (process.env.IS_OFFLINE) {
    log.info('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}



const todosAccess: TodosAccess = new TodosAccessImp();
export default todosAccess;