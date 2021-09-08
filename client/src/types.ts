export interface Answer {
  userId: string;
  questionid: string;
  answers: {
    [year: string]: string;
  };
}
