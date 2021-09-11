import { Reducer, Action } from "@reduxjs/toolkit";
import { takeEvery, put, call, select } from "redux-saga/effects";

import { Answers } from "../../types";
import {
  createAnswers,
  getAnswers,
  updateAnswers,
  uploadPicutre,
} from "../utils/api";
import { getQuestionId } from "../utils/getQuestionId";
import { reduceReducers } from "../utils/reduceReducer";
import { DateState } from "./date";
import { UserActions } from "./user";

/** INITIAL STATE */
/** ------------ */
type AnswersState = {
  isLoading: boolean;
  isSaving: boolean;
  isEditing: boolean;
  isUploading: boolean;
  questionId: string;
  answers?: Answers["answers"];
};

const INITIAL_STATE: AnswersState = {
  isLoading: true,
  isSaving: false,
  isEditing: false,
  isUploading: false,
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
  type: "ANSWERS_FETCHED";
  payload: {
    answers: Answers;
  };
}

interface ANSWERS_EDITING extends Action {
  type: "ANSWERS_EDITING";
}

interface ANSWERS_EDITED extends Action {
  type: "ANSWERS_EDITED";
}

interface ANSWERS_SAVING extends Action {
  type: "ANSWERS_SAVING";
  payload: {
    questionId: string;
    year: number;
    value: string;
  };
}

interface ANSWERS_SAVED extends Action {
  type: "ANSWERS_SAVED";
  payload: {
    answers: Answers;
  };
}

interface ANSWERS_UPLOADING_PICTURE extends Action {
  type: "ANSWERS_UPLOADING_PICTURE";
  payload: {
    file: File;
    questionId: string;
    year: number;
  };
}

interface ANSWERS_UPLOADED_PICTURE extends Action {
  type: "ANSWERS_UPLOADED_PICTURE";
  payload: {
    answers: Answers;
  };
}

export type AnswersActions =
  | ANSWERS_DATE_CHANGED
  | ANSWERS_QUESTION_CHANGED
  | ANSWERS_FETCH
  | ANSWERS_LOADED
  | ANSWERS_EDITING
  | ANSWERS_EDITED
  | ANSWERS_SAVING
  | ANSWERS_SAVED
  | ANSWERS_UPLOADING_PICTURE
  | ANSWERS_UPLOADED_PICTURE;

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

const answersFetchedReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_FETCHED") {
    return state;
  }

  return {
    ...state,
    answers: action.payload.answers.answers,
    isLoading: false,
    isEditing: false,
    isSaving: false,
  };
};

const answersEditingReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_EDITING") {
    return state;
  }

  return {
    ...state,
    isEditing: true,
  };
};

const answersEditedReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_EDITED") {
    return state;
  }

  return {
    ...state,
    isEditing: false,
  };
};

const answersSavingReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_SAVING") {
    return state;
  }

  return {
    ...state,
    isEditing: true,
    isSaving: true,
  };
};

const answersSavedReducer: AnswersReducer = (state = INITIAL_STATE, action) => {
  if (action.type !== "ANSWERS_SAVED") {
    return state;
  }

  return {
    ...state,
    answers: action.payload.answers.answers,
    isEditing: false,
    isSaving: false,
  };
};

const answersUploadingPictureReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_UPLOADING_PICTURE") {
    return state;
  }

  return {
    ...state,
    isUploading: true,
  };
};

const answersUploadedPictureReducer: AnswersReducer = (
  state = INITIAL_STATE,
  action
) => {
  if (action.type !== "ANSWERS_UPLOADED_PICTURE") {
    return state;
  }

  return {
    ...state,
    isUploading: false,
    answers: action.payload.answers["answers"],
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
  const currentYear: string = yield select(
    (state: { date: DateState }) => state.date.currentYear
  );

  try {
    const answers: Answers = yield call(getAnswers, questionId);

    yield put<AnswersActions>({
      type: "ANSWERS_FETCHED",
      payload: { answers },
    });

    // If the answer for the current year doesn't have a value, start editing automatically
    if (!answers.answers?.[currentYear]) {
      yield put<AnswersActions>({
        type: "ANSWERS_EDITING",
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function* answersSavingSaga(action: AnswersActions) {
  if (action.type !== "ANSWERS_SAVING") {
    return;
  }

  const currentAnswers: Answers = yield select(
    (state: { answers: AnswersState }) => state.answers.answers
  );

  try {
    let resultedAnswers: Answers;

    if (!currentAnswers) {
      resultedAnswers = yield call(
        createAnswers,
        action.payload.questionId,
        action.payload.year,
        action.payload.value
      );
    } else {
      resultedAnswers = yield call(
        updateAnswers,
        action.payload.questionId,
        action.payload.year,
        action.payload.value
      );
    }

    yield put<AnswersActions>({
      type: "ANSWERS_SAVED",
      payload: {
        answers: resultedAnswers,
      },
    });
  } catch (error) {
    alert(error);
  }
}

function* answersUploadingPictureSaga(action: AnswersActions) {
  if (action.type !== "ANSWERS_UPLOADING_PICTURE") {
    return;
  }

  const resultedAnswers: Answers = yield call(
    uploadPicutre,
    action.payload.questionId,
    action.payload.year,
    action.payload.file
  );

  yield put<AnswersActions>({
    type: "ANSWERS_UPLOADED_PICTURE",
    payload: {
      answers: resultedAnswers,
    },
  });
}

/** EXPORTS */
/** ------ */
export const answersReducers = reduceReducers(
  INITIAL_STATE,
  answersQuestionChangedReducer,
  answersFetchReducer,
  answersFetchedReducer,
  answersEditingReducer,
  answersEditedReducer,
  answersSavingReducer,
  answersSavedReducer,
  answersUploadingPictureReducer,
  answersUploadedPictureReducer
);

export function* answersSagas() {
  yield takeEvery<AnswersActions>(
    "ANSWERS_DATE_CHANGED",
    answersDateChangedSaga
  );

  yield takeEvery<AnswersActions>("ANSWERS_FETCH", answersFetchSaga);

  yield takeEvery<UserActions>("USER_LOGGED_IN", answersFetchSaga);

  yield takeEvery<AnswersActions>("ANSWERS_SAVING", answersSavingSaga);

  yield takeEvery<AnswersActions>(
    "ANSWERS_UPLOADING_PICTURE",
    answersUploadingPictureSaga
  );
}
