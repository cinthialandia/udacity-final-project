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

export interface CreatingAnswer {
  answer: AnswerEntry;
  questionId: string;
  year: number;
}

export interface UpdatingAnswer {
  answer: AnswerEntry;
  year: number;
}
