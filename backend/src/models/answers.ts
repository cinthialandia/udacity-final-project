export interface Answer {
  year: number;
  answer: string;
}

export interface AnswerList {
  userId: string;
  questionId: string;
  answers: Answer[];
}
