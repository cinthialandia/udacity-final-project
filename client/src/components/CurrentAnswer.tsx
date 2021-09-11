import React from "react";

import "./CurrentAnswer.css";
import { useAppSelector } from "../store";
import { Picture } from "./Picture";
import { AnswerEntry } from "../types";

interface CurrentAnswerProps {
  questionId: string;
  answer?: AnswerEntry;
}

const CurrentAnswer: React.FC<CurrentAnswerProps> = ({
  questionId,
  answer,
}) => {
  const currentYear = useAppSelector((state) => state.date.currentYear);

  return (
    <div className="current-answer-container">
      <div className="current-answer-entry">
        <span className="current-answer-year">{currentYear}</span>
        <span className="current-answer-value">
          {answer?.value || "No answer"}
        </span>
      </div>

      <div className="current-answer-image">
        <Picture answer={answer} />
      </div>
    </div>
  );
};

export default CurrentAnswer;
