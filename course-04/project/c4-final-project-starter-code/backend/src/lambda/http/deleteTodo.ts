import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import todosLogic from "../../businessLogic/todosLogic";
import {StatusCodes} from "http-status-codes";
import * as middy from "middy";
import {cors} from "middy/middlewares";
import {getLogger} from "../../utils/logger";

const log = getLogger();

const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event.requestContext.authorizer.principalId as string;
  const todoId = event.pathParameters.todoId;
  log.info(`deleteTodo with input userId: ${userId} and todoId: ${todoId}`);

  const isSuccessful = await todosLogic.delete(userId, todoId);
  log.info(`generateUploadURL: Successful operation ${JSON.stringify({isSuccessful}, null, 4)}`);
  if (!isSuccessful) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: 'error with the input',
    };
  }

  return {
    statusCode: StatusCodes.NO_CONTENT,
    body: '',
  };
};

export const handler = middy(main)
  .use(
    cors({
      credentials: true,
    })
  );

