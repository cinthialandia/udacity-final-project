const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;

interface params {
  userId: string;
  questionId: string;
  year: string;
}
export const getPictureObjectId = ({
  userId,
  questionId,
  year,
}: params): string => `${userId}-${questionId}-${year}`;

export const getPictureUrl = (params) =>
  `https://${s3Bucket}.s3.amazonaws.com/${getPictureObjectId(params)}`;
