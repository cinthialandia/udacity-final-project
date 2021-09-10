import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getUserId } from "../utils";
import { deleteAnswer } from "../../controllers/answers";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const questionId = event.pathParameters.questionId;
    const year = event.pathParameters.year;

    return deleteAnswer(userId, questionId, year);
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
