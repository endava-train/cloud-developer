import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import todosLogic from "../../businessLogic/todosLogic";
import {StatusCodes} from "http-status-codes";
import * as middy from "middy";
import {cors} from "middy/middlewares";

const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event.requestContext.authorizer.principalId as string;

  const items = await todosLogic.getAll(userId);
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({items}),
  };
}

export const handler = middy(main)
  .use(
    cors({
      credentials: true,
    })
  );