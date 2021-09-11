import React from "react";

import "./Answer.css";
import { Picture } from "../components/Picture";
import { AnswerEntry } from "../types";

interface AnswerProps {
  year: number;
  questionId: string;
  answer: AnswerEntry;
}

const Answer: React.FC<AnswerProps> = ({ year, answer }) => (
  <div className="answer-container">
    <div className="answer-entry">
      <span className="answer-year">{year}</span>
      <span className="answer-value">{answer.value}</span>
    </div>

    <div className="answer-image">
      <Picture answer={answer} />
    </div>
  </div>
);

export default Answer;
