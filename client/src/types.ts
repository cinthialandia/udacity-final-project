export interface Answers {
  userId: string;
  questionid: string;
  answers: {
    [year: string]: string;
  };
}
