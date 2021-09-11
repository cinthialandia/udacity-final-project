import "source-map-support/register";

import * as AWS from "aws-sdk";

import { getBucketId } from "../utils/attachments";
import { createLogger } from "../utils/logger";

const logger = createLogger("service:attachment");

const s3 = new AWS.S3({
  signatureVersion: "v4",
}) as AWS.S3;
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const s3UrlExpiration = process.env.SIGNED_URL_EXPIRATION;

const getAttachmentPresignedUrl = async (
  userId: string,
  questionId: string,
  year: string
): Promise<string> => {
  const params = {
    Bucket: s3Bucket,
    Key: getBucketId({ userId, questionId, year }),
    Expires: Number(s3UrlExpiration),
  };

  logger.info("Getting S3 signed URL", params);

  const signedUrl = s3.getSignedUrl("putObject", params);

  return signedUrl;
};

const deleteAttachmentObject = async (
  userId: string,
  questionId: string,
  year: string
) => {
  const params = {
    Bucket: s3Bucket,
    Key: getBucketId({ userId, questionId, year }),
  };

  logger.info("Deleting S3 object", params);

  await s3.deleteObject(params).promise();

  return;
};

export const AttachmentsS3 = {
  getAttachmentPresignedUrl,
  deleteAttachmentObject,
};
