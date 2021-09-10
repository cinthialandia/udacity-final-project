import React from "react";
import { useTranslation } from "react-i18next";

import "./Home.css";
import { useAppSelector } from "../store";
import Datepicker from "../components/Datepicker";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import Answer from "../components/Answer";
import CurrentAnswer from "../components/CurrentAnswer";

const Home: React.FC = () => {
  const { t, ready } = useTranslation("", { useSuspense: false });
  const { isLoading, questionId, answers } = useAppSelector(
    (state) => state.answers
  );
  const currentYear = useAppSelector((state) => state.date.currentYear);
  const currentAnswer = answers?.[currentYear];
  const previousAnswers = Object.entries(answers || {}).filter(
    ([year]) => Number(year) !== currentYear
  );

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <header className="header-container">
        <Nav />
        <Datepicker />
      </header>

      <h1 className="question">{t(questionId)}</h1>

      {isLoading && <Loading />}

      {!isLoading && (
        <CurrentAnswer questionId={questionId} answer={currentAnswer} />
      )}

      {!isLoading &&
        previousAnswers.map(([year, answer]) => (
          <Answer
            key={year}
            year={Number(year)}
            questionId={questionId}
            answer={answer}
          />
        ))}
    </>
  );
};

export default Home;
