import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { UpdatingAnswer } from "../../types";
import { updateAnswer } from "../../controllers/answers";
import { getUserId } from "../../utils/lambda";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const questionId = event.pathParameters.questionId;
    const updatedAnswers: UpdatingAnswer = JSON.parse(event.body);

    return updateAnswer(userId, questionId, updatedAnswers);
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
