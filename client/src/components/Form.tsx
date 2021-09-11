import React, {
  useState,
  useMemo,
  useCallback,
  ChangeEventHandler,
} from "react";
import { Button, TextField } from "@material-ui/core";

import "./Form.css";
import { AnswerEntry } from "../types";

const validation = new RegExp(/^(?!\s*$).+/);

interface FormProps {
  onSave: (value: string) => void;
  onCancel: () => void;
  isSaving: boolean;
  answer?: AnswerEntry;
  showCancel?: boolean;
}

export const Form: React.FC<FormProps> = ({
  onSave,
  onCancel,
  isSaving,
  answer,
  showCancel,
}) => {
  const [value, setValue] = useState<string>(answer?.value || "");
  const isInvalid = useMemo(() => !validation.test(value), [value]);

  const handleOnAnswerChange: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setValue(e.target.value);
      },
      [setValue]
    );

  const handleOnSubmit: ChangeEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isInvalid) {
        return;
      }

      onSave(value);
    },
    [onSave, isInvalid, value]
  );

  return (
    <form
      onSubmit={handleOnSubmit}
      className="form-container"
      noValidate
      autoComplete="off"
    >
      <TextField
        value={value}
        onChange={handleOnAnswerChange}
        autoFocus
        className="form-input"
        label="Type your answer..."
        variant="outlined"
        color="secondary"
        disabled={isSaving}
      />

      <div className="form-buttons">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isInvalid || isSaving}
        >
          Save
        </Button>
        {showCancel ? (
          <Button onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
};
