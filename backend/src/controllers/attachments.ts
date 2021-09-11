import "source-map-support/register";

import { Answers, AttachmentResponse } from "../types";
import { AnswersDB } from "../services/answers";
import { AttachmentsS3 } from "../services/attachment";
import { getPictureUrl } from "../utils/attachments";
import { createLogger } from "../utils/logger";

const logger = createLogger("controller:answers");

export const generateAttachmentUrl = async (
  userId: string,
  questionId: string,
  year: string
) => {
  logger.info(
    `Generating attachment url for answer year ${year} of question ${questionId} and user ${userId}`
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

    const presignedBucketUrl = await AttachmentsS3.getAttachmentPresignedUrl({
      userId,
      questionId,
      year,
    });

    const pictureUrl = getPictureUrl({ userId, questionId, year });

    const resultedAnswers: Answers = {
      ...currentAnswers,
      answers: {
        ...currentAnswers.answers,
        [year]: {
          ...currentAnswers.answers[year],
          pictureUrl,
        },
      },
    };

    logger.info(
      `Updated attachment url for answer year ${year} of question ${questionId} and user ${userId}`,
      resultedAnswers
    );

    await AnswersDB.update(resultedAnswers);

    logger.info(
      `Generated attachment url for answer year ${year} of question ${questionId} and user ${userId}`,
      presignedBucketUrl
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        url: presignedBucketUrl,
        answers: resultedAnswers,
      } as AttachmentResponse),
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

export const deleteAttacment = async (
  userId: string,
  questionId: string,
  year: string
) => {
  logger.info(
    `Deleting attachment for year ${year} of question ${questionId} and user ${userId}`
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

    const { pictureUrl } = resultedAnsers.answers[year];

    if (pictureUrl) {
      await AttachmentsS3.deleteAttachmentObject(userId, questionId, year);

      delete resultedAnsers.answers[year]?.pictureUrl;

      await AnswersDB.update({
        ...resultedAnsers,
      });
    }

    logger.info(
      `Deleted attachment for year ${year} of question ${questionId} and user ${userId}`,
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
