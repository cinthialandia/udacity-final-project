import { Reducer, Action } from "@reduxjs/toolkit";
import { takeEvery, put, call, select } from "redux-saga/effects";

import { Answers } from "../../types";
import { getAnswers } from "../utils/api";
import { getQuestionId } from "../utils/getQuestionId";
import { reduceReducers } from "../utils/reduceReducer";
import { UserActions } from "./user";

/** INITIAL STATE */
/** ------------ */
type AnswersState = {
  isLoading: boolean;
  questionId: string;
  answers?: Answers["answers"];
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
}

interface ANSWERS_LOADED extends Action {
  type: "ANSWERS_LOADED";
  payload: {
    answers: Answers;
  };
}

export type AnswersActions =
  | ANSWERS_DATE_CHANGED
  | ANSWERS_QUESTION_CHANGED
  | ANSWERS_FETCH
  | ANSWERS_LOADED;

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

const answersFetchReducer: AnswersReducer = (state = INITIAL_STATE, action) => {
  if (action.type !== "ANSWERS_FETCH") {
    return state;
  }

  return {
    ...state,
    isLoading: true,
  };
};

const answersLoadedReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_LOADED") {
    return state;
  }

  return {
    ...state,
    answers: action.payload.answers.answers,
    isLoading: false,
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
  });
}

function* answersFetchSaga() {
  const questionId: string = yield select(
    (state: { answers: AnswersState }) => state.answers.questionId
  );

  try {
    const answers: Answers = yield call(getAnswers, questionId);

    yield put<AnswersActions>({
      type: "ANSWERS_LOADED",
      payload: { answers },
    });
  } catch (error) {
    console.error(error);
  }
}

/** EXPORTS */
/** ------ */
export const answersReducers = reduceReducers(
  INITIAL_STATE,
  answersQuestionChangedReducer,
  answersFetchReducer,
  answersLoadedReducer
);

export function* answersSagas() {
  yield takeEvery<AnswersActions>(
    "ANSWERS_DATE_CHANGED",
    answersDateChangedSaga
  );

  yield takeEvery<AnswersActions>("ANSWERS_FETCH", answersFetchSaga);

  yield takeEvery<UserActions>("USER_LOGGED_IN", answersFetchSaga);
}
