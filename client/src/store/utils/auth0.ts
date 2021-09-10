import { Auth0Client, User } from "@auth0/auth0-spa-js";

export { Auth0Client, User };

export const auth0Client = new Auth0Client({
  domain: "dev-wvaee-nh.us.auth0.com",
  client_id: "yRKmrm8XmrSPFlvT2bzM5sIzEnFzM5XR",
  audience: "https://dev-wvaee-nh.us.auth0.com/api/v2/",
  scope: "read:current_user update:current_user_metadata",
});
