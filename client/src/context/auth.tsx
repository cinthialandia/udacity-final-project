import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

export const AuthProvider: React.FC = ({ children }) => (
  <Auth0Provider
    domain="dev-wvaee-nh.us.auth0.com"
    clientId="yRKmrm8XmrSPFlvT2bzM5sIzEnFzM5XR"
    redirectUri={window.location.origin}
    audience="https://dev-wvaee-nh.us.auth0.com/api/v2/"
    scope="read:current_user update:current_user_metadata"
  >
    {children}
  </Auth0Provider>
);
