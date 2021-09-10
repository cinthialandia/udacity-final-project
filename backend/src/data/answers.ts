import * as AWS from "aws-sdk";

import { CreateAnswer, Answers as IAnswers } from "../types";
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

const createAnswers = async (
  userId: string,
  newAnswer: CreateAnswer
): Promise<IAnswers> => {
  logger.info(`Creating answer ${newAnswer} for user ${userId}`);

  const answersToCreate: IAnswers = {
    userId,
    questionId: newAnswer.questionId,
    answers: {
      [String(newAnswer.year)]: newAnswer.answer,
    },
  };
  await docClient
    .put({
      TableName: answersTable,
      Item: answersToCreate,
    })
    .promise();

  logger.info(`Created answer ${newAnswer} for user ${userId}`);

  return answersToCreate;
};

const updateAnswers = async (
  userId: string,
  newAnswer: CreateAnswer
): Promise<IAnswers> => {
  logger.info(`Updating answer ${newAnswer} for user ${userId}`);

  const updateResponse = await docClient
    .update({
      TableName: answersTable,
      Key: {
        userId,
        questionId: newAnswer.questionId,
      },
      UpdateExpression: "SET answers.#year = :answer",
      ExpressionAttributeNames: {
        "#year": String(newAnswer.year),
      },
      ExpressionAttributeValues: {
        ":answer": {
          ...newAnswer.answer,
        },
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  logger.info(`Updated answer ${newAnswer} for user ${userId}`);

  return updateResponse.Attributes as IAnswers;
};

export const Answers = {
  get: getAnswers,
  create: createAnswers,
  update: updateAnswers,
};
