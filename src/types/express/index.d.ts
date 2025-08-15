import User from "../../models/user.models";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
