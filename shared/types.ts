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
  answer: {
    value: string;
  };
  questionId: string;
  year: number;
}

export interface UpdatingAnswer {
  answer: {
    value: string;
  };
  year: number;
}
