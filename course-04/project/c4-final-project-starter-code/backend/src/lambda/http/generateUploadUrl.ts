import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import {StatusCodes} from 'http-status-codes';
import * as middy from "middy";
import {cors} from "middy/middlewares";
import todosLogic from "../../businessLogic/todosLogic";
import {getLogger} from "../../utils/logger";

const log = getLogger();

const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event.requestContext.authorizer.principalId as string;
  const todoId = event.pathParameters.todoId;

  log.info(`generateUploadURL: ${JSON.stringify({userId, todoId}, null, 4)}`);
  const result = await todosLogic.updateImage(userId, todoId);
  log.info(`generateUploadURL: Successful operation ${JSON.stringify({result}, null, 4)}`);
  if (typeof result === 'boolean' && (<boolean>result) === false) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: 'error with the input',
    }
  }

  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify(result),
  };
}

export const handler = middy(main)
  .use(
    cors({
      credentials: true,
    })
  );
