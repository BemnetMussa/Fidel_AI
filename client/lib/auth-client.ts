import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const baseURL = "http://192.168.37.30:3000";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */

  baseURL,

  plugins: [emailOTPClient()],
});
