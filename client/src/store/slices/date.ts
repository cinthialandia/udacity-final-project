import { Reducer, Action } from "@reduxjs/toolkit";
import { takeEvery, put } from "redux-saga/effects";
import { format } from "date-fns";

import { reduceReducers } from "../utils/reduceReducer";
import { AnswersActions } from "./answers";

/** INITIAL STATE */
/** ------------ */
type DateState = string;

const INITIAL_STATE: DateState = format(new Date(), "yyyy-MM-dd");

/** ACTION TYPES */
/** ----------- */
interface DATE_UPDATED extends Action {
  type: "DATE_UPDATED";
  payload: {
    date: Date;
  };
}

export type DateActions = DATE_UPDATED;

type DateReducer = Reducer<DateState, DateActions>;

/** REDUCERS */
/** -------- */
const dateUpdatedReducer: DateReducer = (state = INITIAL_STATE, action) => {
  if (action.type !== "DATE_UPDATED") {
    return state;
  }

  const newDate = format(action.payload.date, "yyyy-MM-dd");

  return newDate;
};

/** SAGAS */
/** ----- */

function* dateUpdatedSaga(action: DateActions) {
  yield put<AnswersActions>({
    type: "ANSWERS_DATE_CHANGED",
    payload: action.payload,
  });
}

/** EXPORTS */
/** ------ */
export const dateReducers = reduceReducers(INITIAL_STATE, dateUpdatedReducer);

export function* dateSagas() {
  yield takeEvery<DateActions>("DATE_UPDATED", dateUpdatedSaga);
}
