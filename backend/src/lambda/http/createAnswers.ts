import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getUserId } from "../utils";
import { createAnswer } from "../../controllers/answers";
import { CreateAnswer } from "../../types";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const newAnswer: CreateAnswer = JSON.parse(event.body);

    return createAnswer(userId, newAnswer);
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
