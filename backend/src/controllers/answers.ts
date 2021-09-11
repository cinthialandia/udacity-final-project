import "source-map-support/register";

import { Answers, CreatingAnswer, UpdatingAnswer } from "../types";
import { AnswersDB } from "../services/answers";
import { createLogger } from "../utils/logger";

const logger = createLogger("controller:answers");

export const getAnswers = async (userId: string, questionId: string) => {
  logger.info(`Getting answers for user ${userId} and question: ${questionId}`);

  try {
    const answers = await AnswersDB.get(userId, questionId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        ...answers,
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

export const createAnswer = async (
  userId: string,
  creatingAnswers: CreatingAnswer
) => {
  logger.info(
    `Creating answer for question ${creatingAnswers.questionId} and user ${userId}`
  );

  try {
    const currentAnswers = await AnswersDB.get(
      userId,
      creatingAnswers.questionId
    );

    if (currentAnswers) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: `Answers for question ${creatingAnswers.questionId} already exists. Use UPDATE instead`,
        }),
      };
    }

    const resultedAnswers: Answers = {
      userId,
      questionId: creatingAnswers.questionId,
      answers: {
        [creatingAnswers.year]: creatingAnswers.answer,
      },
    };

    await AnswersDB.create(resultedAnswers);

    logger.info(`Created answer`, resultedAnswers);

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

export const updateAnswer = async (
  userId: string,
  questionId: string,
  updatingAnswer: UpdatingAnswer
) => {
  logger.info(
    `Updating answer for question ${questionId} and user ${userId}`,
    updatingAnswer
  );

  try {
    const currentAnswers = await AnswersDB.get(userId, questionId);

    if (!currentAnswers) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `There are no answers for question ${questionId}. Use CREATE instead`,
        }),
      };
    }

    const resultedAnswers: Answers = {
      ...currentAnswers,
      answers: {
        ...currentAnswers.answers,
        [updatingAnswer.year]: {
          ...currentAnswers.answers[updatingAnswer.year],
          value: updatingAnswer.answer.value,
        },
      },
    };

    await AnswersDB.update(resultedAnswers);

    logger.info(`Updated answer`, resultedAnswers);

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

export const deleteAnswer = async (
  userId: string,
  questionId: string,
  year: string
) => {
  logger.info(
    `Deleting year ${year} for question ${questionId} and user ${userId}`
  );

  try {
    const currentAnswers = await AnswersDB.get(userId, questionId);

    if (!currentAnswers) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `There are no answers for question ${questionId}`,
        }),
      };
    }

    const resultedAnsers: Answers = {
      ...currentAnswers,
    };

    delete resultedAnsers.answers[year];

    await AnswersDB.update({
      ...resultedAnsers,
    });

    logger.info(
      `Deleted year ${year} for question ${questionId} and user ${userId}`,
      resultedAnsers
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        ...resultedAnsers,
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
