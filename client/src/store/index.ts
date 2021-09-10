import {
  combineReducers,
  createStore,
  applyMiddleware,
} from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from "redux-saga";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { all } from "redux-saga/effects";

import { userReducers, userSagas } from "./slices/user";
import { dateReducers, dateSagas } from "./slices/date";
import { answersReducers, answersSagas } from "./slices/answers";

const rootReducer = combineReducers({
  user: userReducers,
  date: dateReducers,
  answers: answersReducers,
});

function* rootSaga() {
  yield all([userSagas(), dateSagas(), answersSagas()]);
}

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
