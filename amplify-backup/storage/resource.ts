// amplify/storage/resource.ts
import { storage } from "@aws-amplify/backend";

export const myStorage = storage({
  access: (auth) => ({
    "public/": ["read", "write"],
    "protected/": ["read", "write"],
    "private/": ["read", "write"],
  }),
});

