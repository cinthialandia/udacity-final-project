import * as AWS from "aws-sdk";
import { createLogger } from "./logger";

const logger = createLogger("utils:attachment");

const s3 = new AWS.S3({
  signatureVersion: "v4",
}) as AWS.S3;
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const s3UrlExpiration = process.env.SIGNED_URL_EXPIRATION;

export const getAttachmentPresignedUrl = async (
  userId: string,
  questionId: string,
  year: string
): Promise<string> => {
  const params = {
    Bucket: s3Bucket,
    Key: `${userId}-${questionId}-${year}`,
    Expires: Number(s3UrlExpiration),
  };

  logger.info("Getting S3 signed URl", params);

  return s3.getSignedUrl("putObject", params);
};
