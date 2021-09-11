interface params {
  userId: string;
  questionId: string;
  year: string;
}
export const getBucketId = ({ userId, questionId, year }: params): string =>
  `${userId}-${questionId}-${year}`;
