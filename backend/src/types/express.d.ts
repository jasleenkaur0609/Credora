import type { AuthenticatedRequestContext } from "../modules/auth/auth.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedRequestContext;
    }
  }
}

export {};