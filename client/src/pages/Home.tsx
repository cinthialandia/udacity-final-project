import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import "./Home.css";
import Datepicker from "../components/Datepicker";
import Nav from "../components/Nav";
import Loading from "../components/Loading";

const Home: React.FC = () => {
  const [date, setDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const { t, ready } = useTranslation("", { useSuspense: false });

  const getQuestionId = React.useCallback(() => {
    const dateAsDate = new Date(date);
    const dateMonth = dateAsDate.getMonth() + 1;
    const dateDay = dateAsDate.getDate();
    return `d${dateDay}-m${dateMonth}`;
  }, [date]);

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <header className="header-container">
        <Nav />
        <Datepicker date={date} setDate={setDate} />
      </header>

      <h1 className="question">{t(getQuestionId())}</h1>
    </>
  );
};

export default Home;
