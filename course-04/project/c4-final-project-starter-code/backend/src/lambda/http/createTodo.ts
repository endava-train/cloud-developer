import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import todosLogic from "../../businessLogic/todosLogic";
import {StatusCodes} from 'http-status-codes';
import {cors} from 'middy/middlewares';
import * as middy from 'middy';

export const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.principalId as string;

  const item = await todosLogic.create(createTodoRequest, userId);
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
