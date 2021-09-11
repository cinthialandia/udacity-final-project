import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { CreatingAnswer } from "../../types";
import { createAnswer } from "../../controllers/answers";
import { getUserId } from "../../utils/lambda";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const creatingAnswer: CreatingAnswer = JSON.parse(event.body);

    return createAnswer(userId, creatingAnswer);
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
