import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import todosLogic from "../../businessLogic/todosLogic";
import {StatusCodes} from 'http-status-codes';
import {cors} from 'middy/middlewares';
import * as middy from 'middy';
import {getLogger} from "../../utils/logger";

const log = getLogger();

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.principalId as string;

  log.info(`createTodo with input userId: ${userId}`);
  const item = await todosLogic.create(createTodoRequest, userId);
  log.info(`createTodo: Successful operation ${JSON.stringify({item}, null, 4)}`);
  return {
    statusCode: StatusCodes.CREATED,
    body: JSON.stringify({item}),
  };
};

export const handler = middy(main)
  .use(
    cors({
      credentials: true,
    })
  );
