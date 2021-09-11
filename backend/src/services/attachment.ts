import "source-map-support/register";

import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

import { getPictureObjectId } from "../utils/attachments";
import { createLogger } from "../utils/logger";

const logger = createLogger("service:attachment");

const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({
  signatureVersion: "v4",
}) as AWS.S3;
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const s3UrlExpiration = process.env.SIGNED_URL_EXPIRATION;

interface Params {
  userId: string;
  questionId: string;
  year: string;
}

const getAttachmentPresignedUrl = async ({
  userId,
  questionId,
  year,
}: Params): Promise<string> => {
  const bucketParams = {
    Bucket: s3Bucket,
    Key: getPictureObjectId({ userId, questionId, year }),
    Expires: Number(s3UrlExpiration),
  };

  logger.info("Getting S3 signed URL", bucketParams);

  const signedUrl = s3.getSignedUrl("putObject", bucketParams);

  return signedUrl;
};

const deleteAttachmentObject = async (
  userId: string,
  questionId: string,
  year: string
) => {
  const params = {
    Bucket: s3Bucket,
    Key: getPictureObjectId({ userId, questionId, year }),
  };

  logger.info("Deleting S3 object", params);

  await s3.deleteObject(params).promise();

  return;
};

export const AttachmentsS3 = {
  getAttachmentPresignedUrl,
  deleteAttachmentObject,
};
