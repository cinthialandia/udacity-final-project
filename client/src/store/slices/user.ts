import { Reducer, Action } from "@reduxjs/toolkit";
import { User } from "@auth0/auth0-react";

import { reduceReducers } from "../utils";

interface UserState {
  isLoading: boolean;
  user?: User;
  token?: string;
}

interface USER_LOGGED_IN extends Action {
  type: "USER_LOGGED_IN";
  payload: {
    user: User;
    token: string;
  };
}

type UserActions = USER_LOGGED_IN;

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

/** EXPORTS */
/** ------ */
export const userReducers = reduceReducers(INITIAL_STATE, userLoggedInReducer);
