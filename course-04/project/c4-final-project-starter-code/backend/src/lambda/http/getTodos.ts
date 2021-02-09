import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import todosLogic from "../../businessLogic/todosLogic";
import {StatusCodes} from "http-status-codes";
import * as middy from "middy";
import {cors} from "middy/middlewares";
import {getLogger} from "../../utils/logger";

const log = getLogger();

const main: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = event.requestContext.authorizer.principalId as string;

  log.info("getTodos: " + JSON.stringify({userId}, null, 4))
  const items = await todosLogic.getAll(userId);
  log.info(`getTodos: Successful operation ${JSON.stringify({items}, null, 4)}`);
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