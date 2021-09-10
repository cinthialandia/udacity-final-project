export interface Answers {
  userId: string;
  questionId: string;
  answers: {
    [year: string]: {
      value: string;
      pictureUrl?: string;
    };
  };
}

export type AnswerEntry = Answers["answers"][string];

export interface CreateAnswer {
  answer: AnswerEntry;
  questionId: string;
  year: number;
}
