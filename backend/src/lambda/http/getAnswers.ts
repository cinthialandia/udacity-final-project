import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getAnswers } from "../../controllers/answers";
import { getUserId } from "../../utils/lambda";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const questionId = event.pathParameters.questionId;

    return getAnswers(userId, questionId);
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
