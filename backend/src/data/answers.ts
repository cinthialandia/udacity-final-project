import * as AWS from "aws-sdk";

import { AnswerList } from "../models/answers";
import { createLogger } from "../utils/logger";

const logger = createLogger("todos");
const answersTable = process.env.ANSWERS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient();

export const getAnswers = async (
  userId: string,
  questionId: string
): Promise<AnswerList> => {
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

  logger.info(`Got answers for user ${userId} and question: ${questionId}`),
    result;

  return result.Item as AnswerList;
};
