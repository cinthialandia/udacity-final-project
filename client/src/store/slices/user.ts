import { Reducer, Action } from "@reduxjs/toolkit";
import { takeEvery, call, put } from "redux-saga/effects";

import { auth0Client, User } from "../utils/auth0";
import { reduceReducers } from "../utils/reduceReducer";

interface UserState {
  isLoading: boolean;
  user?: User;
  token?: string;
}

/** ACTION TYPES */
/** ----------- */
interface USER_ATTEMPT_LOGIN extends Action {
  type: "USER_ATTEMPT_LOGIN";
}

interface USER_LOGGED_IN extends Action {
  type: "USER_LOGGED_IN";
  payload: {
    user: User;
    token: string;
  };
}

interface USER_LOGOUT extends Action {
  type: "USER_LOGOUT";
}

type UserActions = USER_ATTEMPT_LOGIN | USER_LOGGED_IN | USER_LOGOUT;

type UserActionTypes = UserActions["type"];

type UserReducer = Reducer<UserState, UserActions>;

/** INITIAL STATE */
/** ------------ */

const INITIAL_STATE: UserState = { isLoading: true };

/** REDUCERS */
/** -------- */
const userLoggedInReducer: UserReducer = (state = INITIAL_STATE, action) => {
  if (action.type !== "USER_LOGGED_IN") {
    return state;
  }

  return {
    isLoading: false,
    user: action.payload.user,
    token: action.payload.token,
  };
};

/** SAGAS */
/** ----- */
// TODO: fix this saga. it causes an infinite loop when logging in
function* userAttemptLoginSaga() {
  const authenticated: Boolean = yield call(
    auth0Client.isAuthenticated.bind(auth0Client)
  );

  // If not authenticated, redirect to login screen
  if (!authenticated) {
    yield call(auth0Client.loginWithRedirect.bind(auth0Client), {
      redirect_uri: window.location.origin,
    });
  }

  const user: User = yield call(auth0Client.getUser.bind(auth0Client));
  const token: string = yield call(
    auth0Client.getTokenSilently.bind(auth0Client)
  );

  yield put<UserActions>({ type: "USER_LOGGED_IN", payload: { user, token } });
}

function* userLogoutSaga() {
  yield call(auth0Client.logout.bind(auth0Client), {
    returnTo: window.location.origin,
  });
}

/** EXPORTS */
/** ------ */
export const userReducers = reduceReducers(INITIAL_STATE, userLoggedInReducer);

export function* userSagas() {
  yield takeEvery<UserActionTypes>("USER_ATTEMPT_LOGIN", userAttemptLoginSaga);

  yield takeEvery<UserActionTypes>("USER_LOGOUT", userLogoutSaga);
}
