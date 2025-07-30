// amplify/auth/resource.ts
import { auth } from "@aws-amplify/backend";

export const myAuth = auth({
  loginWith: {
    email: true,
  },
});

