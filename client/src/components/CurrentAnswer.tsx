import React from "react";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

import "./CurrentAnswer.css";
import { useAppSelector, useAppDispatch } from "../store";
import { Picture } from "./Picture";
import { Form } from "./Form";
import { AnswerEntry } from "../types";

interface CurrentAnswerProps {
  questionId: string;
  answer?: AnswerEntry;
}

const CurrentAnswer: React.FC<CurrentAnswerProps> = ({
  questionId,
  answer,
}) => {
  const dispatch = useAppDispatch();
  const year = useAppSelector((state) => state.date.currentYear);
  const { isEditing, isSaving } = useAppSelector((state) => state.answers);

  const handleOnEdit = () => {
    dispatch({ type: "ANSWERS_EDITING" });
  };

  const handleOnCancel = () => {
    dispatch({ type: "ANSWERS_EDITED" });
  };

  const handleOnSave = (value: string) => {
    dispatch({
      type: "ANSWERS_SAVING",
      payload: {
        questionId,
        year,
        value,
      },
    });
  };

  return (
    <div className="current-answer-container">
      <div
        className={`current-answer-entry ${
          isEditing ? "current-answer-entry--editing" : ""
        }`}
      >
        <div className="current-answer-year">{year}</div>
        {isEditing ? (
          <div className="current-answer-form">
            <Form
              answer={answer}
              onSave={handleOnSave}
              onCancel={handleOnCancel}
              showCancel={!!answer}
              isSaving={isSaving}
            />
          </div>
        ) : (
          <div className="current-answer-value-container">
            <div className="current-answer-value">{answer?.value}</div>
            <Button color="primary" onClick={handleOnEdit}>
              <EditIcon />
            </Button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="current-answer-image">
          <Picture answer={answer} />
        </div>
      ) : null}
    </div>
  );
};

export default CurrentAnswer;
