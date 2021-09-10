import React from "react";
import { AnswerEntry } from "../types";

interface CurrentAnswerProps {
  questionId: string;
  answer?: AnswerEntry;
}

const CurrentAnswer: React.FC<CurrentAnswerProps> = () => (
  <div>Current Answer</div>
);

export default CurrentAnswer;
