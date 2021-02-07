import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest';
import todosLogic from "../../businessLogic/todosLogic";
import {StatusCodes} from "http-status-codes";
import * as middy from "middy";
import {cors} from "middy/middlewares";
import {getLogger} from "../../utils/logger";

const log = getLogger();

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const todoId = event.pathParameters.todoId;
  const userId = event.requestContext.authorizer.principalId as string;

  log.info(`main: userId: ${userId}, todoId: ${todoId})`);
  const isSuccessful = await todosLogic.update(updatedTodo, userId, todoId);
  if (!isSuccessful) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: 'error with the input',
    };
  }

  return {
    statusCode: StatusCodes.OK,
    body: ''
  };
}

export const handler = middy(main)
  .use(
    cors({
      credentials: true,
    })
  );