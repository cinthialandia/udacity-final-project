import { Reducer, Action } from "@reduxjs/toolkit";
import { takeEvery, put } from "redux-saga/effects";
import { getQuestionId } from "../utils/getQuestionId";

import { reduceReducers } from "../utils/reduceReducer";

/** INITIAL STATE */
/** ------------ */
type AnswersState = {
  isLoading: boolean;
  questionId: string;
};

const INITIAL_STATE: AnswersState = {
  isLoading: true,
  questionId: getQuestionId(new Date()),
};

/** ACTION TYPES */
/** ----------- */
interface ANSWERS_DATE_CHANGED extends Action {
  type: "ANSWERS_DATE_CHANGED";
  payload: {
    date: Date;
  };
}

interface ANSWERS_QUESTION_CHANGED extends Action {
  type: "ANSWERS_QUESTION_CHANGED";
  payload: {
    questionId: string;
  };
}

interface ANSWERS_FETCH extends Action {
  type: "ANSWERS_FETCH";
  payload: {
    questionId: string;
  };
}

export type AnswersActions =
  | ANSWERS_DATE_CHANGED
  | ANSWERS_QUESTION_CHANGED
  | ANSWERS_FETCH;

type AnswersReducer = Reducer<AnswersState, AnswersActions>;

/** REDUCERS */
/** -------- */
const answersQuestionChangedReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_QUESTION_CHANGED") {
    return state;
  }

  return {
    ...state,
    questionId: action.payload.questionId,
  };
};

/** SAGAS */
/** ----- */
function* answersDateChangedSaga(action: AnswersActions) {
  if (action.type !== "ANSWERS_DATE_CHANGED") {
    return;
  }

  const newQuestionId = getQuestionId(action.payload.date);

  yield put<AnswersActions>({
    type: "ANSWERS_QUESTION_CHANGED",
    payload: {
      questionId: newQuestionId,
    },
  });

  yield put<AnswersActions>({
    type: "ANSWERS_FETCH",
    payload: {
      questionId: newQuestionId,
    },
  });
}

function* answersFetch(action: AnswersActions) {
  if (action.type !== "ANSWERS_FETCH") {
    return;
  }

  yield;

  // const answers: Answers = yield call(
  //   fetch,
  //   `https://eekguocox7.execute-api.us-east-1.amazonaws.com/answers/${action.payload.questionId}`
  // );

  // console.log(answers);
}

/** EXPORTS */
/** ------ */
export const answersReducers = reduceReducers(
  INITIAL_STATE,
  answersQuestionChangedReducer
);

export function* answersSagas() {
  yield takeEvery<AnswersActions>(
    "ANSWERS_DATE_CHANGED",
    answersDateChangedSaga
  );

  yield takeEvery<AnswersActions>("ANSWERS_FETCH", answersFetch);
}
