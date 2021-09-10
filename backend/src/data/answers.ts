import * as AWS from "aws-sdk";

import { Answers as IAnswers } from "../types";
import { createLogger } from "../utils/logger";

const logger = createLogger("data:answers");
const answersTable = process.env.ANSWERS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();

const getAnswers = async (
  userId: string,
  questionId: string
): Promise<IAnswers | undefined> => {
  logger.info(`Getting answers for user ${userId} and question: ${questionId}`);

  const result = await docClient
    .get({
      TableName: answersTable,
      Key: {
        userId,
        questionId,
      },
    })
    .promise();

  logger.info(`Got answers for user ${userId} and question: ${questionId}`, {
    ...result.Item,
  }),
    result;

  return result.Item as IAnswers;
};

const createAnswers = async (newAnswers: IAnswers): Promise<void> => {
  logger.info(
    `Creating answers for question ${newAnswers.questionId} and user ${newAnswers.userId}`
  );

  await docClient
    .put({
      TableName: answersTable,
      Item: newAnswers,
    })
    .promise();

  logger.info(
    `Creating answers for question ${newAnswers.questionId} and user ${newAnswers.userId}`
  );
};

const updateAnswers = async (updatedAnswers: IAnswers): Promise<void> => {
  logger.info(
    `Updating answers for question ${updatedAnswers.questionId} and user ${updatedAnswers.userId}`,
    updatedAnswers
  );

  await docClient
    .update({
      TableName: answersTable,
      Key: {
        userId: updatedAnswers.userId,
        questionId: updatedAnswers.questionId,
      },
      UpdateExpression: "SET answers = :answers",
      ExpressionAttributeValues: {
        ":answers": {
          ...updatedAnswers.answers,
        },
      },
    })
    .promise();

  logger.info(
    `Updating answers for question ${updatedAnswers.questionId} and user ${updatedAnswers.userId}`
  );
};

export const Answers = {
  get: getAnswers,
  create: createAnswers,
  update: updateAnswers,
};
