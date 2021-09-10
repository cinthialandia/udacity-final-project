import React from "react";
import { AnswerEntry } from "../types";

interface AnswerProps {
  year: number;
  questionId: string;
  answer: AnswerEntry;
}

const Answer: React.FC<AnswerProps> = ({ year, answer }) => (
  <div>
    <span>{year}: </span>
    <span>{answer.value}</span>
  </div>
);

export default Answer;
