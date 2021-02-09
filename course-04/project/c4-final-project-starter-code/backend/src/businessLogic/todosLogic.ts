import todosAccessImp, {TodosAccess} from "../dataLayer/todosAccess";
import {TodoItem} from "../models/TodoItem";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import * as uuid from 'uuid';
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import imagesLogicImp, {ImagesLogic} from "./imagesLogic";
import {UploadURL} from "../models/UploadURL";
import {getLogger} from "../utils/logger";

const log = getLogger();

interface TodosLogic {
  getAll(userId: string): Promise<TodoItem[]>;
  create(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem>;
  update(createTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<boolean>;
  updateImage(userId: string, todoId: string): Promise<UploadURL | boolean>;
  delete(userId: string, todoId: string): Promise<boolean>;
}

class TodosLogicImp implements TodosLogic {
  constructor(
    private readonly todosAccess: TodosAccess = todosAccessImp,
    private readonly imagesLogic: ImagesLogic = imagesLogicImp,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET
  ) {}


  async getAll(userId: string): Promise<TodoItem[]> {
    log.info(`getAll with input userId: ${userId}`);
    return this.todosAccess.getAll(userId);
  }

  async create(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId = uuid.v4();
    log.info(`create with input userId: ${JSON.stringify({createTodoRequest, todoId, userId}, null, 4)}`);
    return await this.todosAccess.create({
      userId: userId,
      todoId,
      createdAt: new Date().toISOString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
    });
  }

  async update(createTodoRequest: UpdateTodoRequest, userId: string, todoId: string): Promise<boolean> {
    const isValid = await this.validateUser(userId, todoId);
    log.info(`update User is valid: ${isValid}`);
    if (!isValid) {
      return isValid;
    }

    log.info("updating...");
    await this.todosAccess.update({
      userId: userId,
      todoId: todoId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: createTodoRequest.done,
    });

    return Promise.resolve(true);
  }

  async updateImage(userId: string, todoId: string): Promise<UploadURL | boolean> {
    const isValid = await this.validateUser(userId, todoId);
    log.info(`updateImage User is valid: ${isValid}`);
    if (!isValid) {
      return false;
    }

    const result = await this.imagesLogic.uploadUrl(todoId);
    log.info("updating the field");
    const currentTodo = await this.todosAccess.getById(userId, todoId);
    currentTodo.attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    await this.todosAccess.update(currentTodo);
    return result;
  }

  async delete(userId: string, todoId: string): Promise<boolean> {
    log.info(`deleteLogic userId: ${userId}, todoId: ${todoId}`);
    const isValid = await this.validateUser(userId, todoId);
    log.info(`delete User is valid: ${isValid}`);
    if (!isValid) {
      return isValid;
    }

    return this.todosAccess.delete(todoId, userId);
  }


  private async validateUser(userId: string, todoId: string): Promise<boolean> {
    log.info(`validUser - userId: ${userId} and todoId: ${todoId}`);
    const currentTodo = await this.todosAccess.getById(userId, todoId);
    log.info(`validateUser ${typeof currentTodo} ${JSON.stringify(currentTodo)}`);
    return currentTodo && currentTodo.userId === userId;
  }
}

const todosLogicImp: TodosLogic = new TodosLogicImp();
export default todosLogicImp;