import React from "react";
import { addDays, subDays } from "date-fns";
import Button from "@material-ui/core/Button";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TextField from "@material-ui/core/TextField";

import "./Datepicker.css";
import { useAppDispatch, useAppSelector } from "../store";

const Datepicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateSelected = useAppSelector((state) => state.date.dateSelected);

  const handleInput = (e: any) => {
    dispatch({
      type: "DATE_UPDATED",
      payload: {
        date: e.target.valueAsDate,
      },
    });
  };

  const handleClickPrev = () => {
    const subDate = subDays(new Date(dateSelected), 1);
    dispatch({ type: "DATE_UPDATED", payload: { date: subDate } });
  };

  const handleClickNext = () => {
    const addDate = addDays(new Date(dateSelected), 1);
    dispatch({ type: "DATE_UPDATED", payload: { date: addDate } });
  };

  return (
    <div className="date-picker-container">
      <Button color="primary" onClick={handleClickPrev}>
        <ArrowLeftIcon></ArrowLeftIcon>
      </Button>
      <TextField type="date" value={dateSelected} onChange={handleInput} />
      <Button color="primary" onClick={handleClickNext}>
        <ArrowRightIcon></ArrowRightIcon>
      </Button>
    </div>
  );
};

export default Datepicker;
