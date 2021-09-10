import "source-map-support/register";

import { createLogger } from "../utils/logger";
import { Answers } from "../data/answers";
import { CreateAnswer, Answers as IAnswers } from "../types";

const logger = createLogger("controller:answers");

export const getAnswers = async (userId: string, questionId: string) => {
  logger.info(`Getting answers for user ${userId} and question: ${questionId}`);

  try {
    const answers = await Answers.get(userId, questionId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        ...answers,
      }),
    };
  } catch (error) {
    logger.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "internal error",
      }),
    };
  }
};

export const createAnswer = async (userId: string, newAnswer: CreateAnswer) => {
  logger.info(`Saving answer ${newAnswer} for user ${userId}`);

  try {
    const answersExists = !!(await Answers.get(userId, newAnswer.questionId));

    let resultedAnswers: IAnswers;

    if (answersExists) {
      logger.info(
        `Answers for questionId ${newAnswer.questionId} and userId ${userId} exists, updating.`
      );

      resultedAnswers = await Answers.update(userId, newAnswer);
    } else {
      logger.info(
        `Answers for questionId ${newAnswer.questionId} and userId ${userId} don't exists, creating new record.`
      );

      resultedAnswers = await Answers.create(userId, newAnswer);
    }

    logger.info(`Saved answer ${resultedAnswers}`);

    return {
      statusCode: 201,
      body: JSON.stringify({
        ...resultedAnswers,
      }),
    };
  } catch (error) {
    logger.error(error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "internal error",
      }),
    };
  }
};
