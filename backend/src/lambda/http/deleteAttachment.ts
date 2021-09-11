import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { deleteAttacment } from "../../controllers/attachments";
import { getUserId } from "../../utils/lambda";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const questionId = event.pathParameters.questionId;
    const year = event.pathParameters.year;

    return deleteAttacment(userId, questionId, String(year));
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
