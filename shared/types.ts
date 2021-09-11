export type AnswerEntry = {
  value: string;
  pictureUrl?: string;
};

export interface Answers {
  userId: string;
  questionId: string;
  answers: {
    [year: string]: AnswerEntry;
  };
}

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
