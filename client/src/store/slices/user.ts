import { Reducer, Action } from "@reduxjs/toolkit";
import { takeEvery, call, put } from "redux-saga/effects";

import { auth0Client, User } from "../utils/auth0";
import { reduceReducers } from "../utils/reduceReducer";

/** INITIAL STATE */
/** ------------ */
interface UserState {
  isLoading: boolean;
  user?: User;
  token?: string;
}

const INITIAL_STATE: UserState = { isLoading: true };

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

type UserReducer = Reducer<UserState, UserActions>;

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
// discovered how to properly handle the redirect callback in:
// https://gist.github.com/klequis/fd9c3cf5b025cc26a282ea30ef8ff6da#file-react-auth0-spa-js-L41-L64
function* userAttemptLoginSaga() {
  // Handle redirect callback if code is present in the URL
  if (window.location.search.includes("code=")) {
    yield call(auth0Client.handleRedirectCallback.bind(auth0Client));
    window.history.replaceState({}, document.title, window.location.pathname);
  }

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
  yield takeEvery<UserActions>("USER_ATTEMPT_LOGIN", userAttemptLoginSaga);

  yield takeEvery<UserActions>("USER_LOGOUT", userLogoutSaga);
}
