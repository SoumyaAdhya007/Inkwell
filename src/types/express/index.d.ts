import User from "../../models/user.models";
export type decodedUser = Pick<User, "_id", "email", "role", "isVerified">;
declare global {
  namespace Express {
    export interface Request {
      user?: decodedUser;
    }
  }
}
export {};
