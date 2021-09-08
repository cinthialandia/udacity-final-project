import React from "react";
import { addDays, subDays, format } from "date-fns";
import Button from "@material-ui/core/Button";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import TextField from "@material-ui/core/TextField";

import "./Datepicker.css";

interface DatepickerProps {
  date: string;
  setDate: (date: string) => void;
}

const Datepicker: React.FC<DatepickerProps> = ({ date, setDate }) => {
  const handleDateChange = (date: Date) => {
    const dateAsString = format(date, "yyyy-MM-dd");
    setDate(dateAsString);
  };

  const handleInput = (e: any) => {
    handleDateChange(e.target.valueAsDate);
  };

  const handleClickPrev = () => {
    const subDate = subDays(new Date(date), 1);
    handleDateChange(subDate);
  };

  const handleClickNext = () => {
    const addDate = addDays(new Date(date), 1);
    handleDateChange(addDate);
  };

  return (
    <div className="date-picker-container">
      <Button color="primary" onClick={handleClickPrev}>
        <ArrowLeftIcon></ArrowLeftIcon>
      </Button>
      <TextField type="date" value={date} onChange={handleInput} />
      <Button color="primary" onClick={handleClickNext}>
        <ArrowRightIcon></ArrowRightIcon>
      </Button>
    </div>
  );
};

export default Datepicker;
