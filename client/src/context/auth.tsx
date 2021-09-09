import React from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

import { useAppDispatch } from "../store";

export const AuthStateProvider: React.FC = ({ children }) => {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
    user,
  } = useAuth0();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const checkAuthenticated = () => {
      if (!isLoading && !isAuthenticated) {
        loginWithRedirect();
      }
    };

    checkAuthenticated();
  });

  React.useEffect(() => {
    const storeUserAndToken = async () => {
      if (!user) {
        return;
      }

      const token = await getAccessTokenSilently();

      dispatch({
        type: "USER_LOGGED_IN",
        payload: {
          user,
          token,
        },
      });
    };

    storeUserAndToken();
  });

  return <>{children}</>;
};

export const AuthProvider: React.FC = ({ children }) => (
  <Auth0Provider
    domain="dev-wvaee-nh.us.auth0.com"
    clientId="yRKmrm8XmrSPFlvT2bzM5sIzEnFzM5XR"
    redirectUri={window.location.origin}
    audience="https://dev-wvaee-nh.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
  >
    <AuthStateProvider>{children}</AuthStateProvider>
  </Auth0Provider>
);
