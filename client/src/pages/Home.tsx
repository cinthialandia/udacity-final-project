import React from "react";
import { useTranslation } from "react-i18next";

import "./Home.css";
import Datepicker from "../components/Datepicker";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import { useAppSelector } from "../store";

const Home: React.FC = () => {
  const { questionId } = useAppSelector((state) => state.answers);
  const { t, ready } = useTranslation("", { useSuspense: false });

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <header className="header-container">
        <Nav />
        <Datepicker />
      </header>

      {questionId && <h1 className="question">{t(questionId)}</h1>}
    </>
  );
};

export default Home;
