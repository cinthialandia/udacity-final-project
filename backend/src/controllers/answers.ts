import "source-map-support/register";

import { createLogger } from "../utils/logger";
import { Answers } from "../data/answers";
import { CreatingAnswer, Answers as IAnswers, UpdatingAnswer } from "../types";
import { getAttachmentPresignedUrl } from "./attachment";

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
    const currentAnswers = await Answers.get(
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

    const resultedAnswers: IAnswers = {
      userId,
      questionId: creatingAnswers.questionId,
      answers: {
        [creatingAnswers.year]: creatingAnswers.answer,
      },
    };

    await Answers.create(resultedAnswers);

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
    const currentAnswers = await Answers.get(userId, questionId);

    if (!currentAnswers) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `There are no answers for question ${questionId}. Use CREATE instead`,
        }),
      };
    }

    const resultedAnswers: IAnswers = {
      ...currentAnswers,
      answers: {
        ...currentAnswers.answers,
        [updatingAnswer.year]: updatingAnswer.answer,
      },
    };

    await Answers.update(resultedAnswers);

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
    const currentAnswers = await Answers.get(userId, questionId);

    if (!currentAnswers) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `There are no answers for question ${questionId}`,
        }),
      };
    }

    const resultedAnsers: IAnswers = {
      ...currentAnswers,
    };

    delete resultedAnsers.answers[year];

    await Answers.update({
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
