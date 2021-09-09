import "source-map-support/register";

import { createLogger } from "../utils/logger";
import { Answers } from "../data/answers";

const logger = createLogger("controller:answers");

export const getAnswers = async (userId: string, questionId: string) => {
  logger.info(`Getting answers for user ${userId} and question: ${questionId}`);

  try {
    const answers = await Answers.get(userId, questionId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        answers,
      }),
    };
  } catch (error) {
    logger.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        messagE: "internal error",
      }),
    };
  }
};
