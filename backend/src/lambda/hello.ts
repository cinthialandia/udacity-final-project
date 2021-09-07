import "source-map-support/register";

import { APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

export const handler = middy(async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello back!",
    }),
  };
});

handler.use(
  cors({
    credentials: true,
  })
);
