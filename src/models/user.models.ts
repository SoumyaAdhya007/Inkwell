import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userRolesEnum, AvailableUserRoles } from "../utils/constants";
import env from "../config/env.config";
import { generateVerificationEmail, sendMail } from "../utils/mail";
import { StringValue } from "ms";
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  verificationToken?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  verificationExpiry?: Date;
  refreshTokenExpiry?: Date;
  resetPasswordExpiry?: Date;
  // Method signatures
  comparePassword(password: string): Promise<boolean>;
  generateVerificationToken(): { token: string; expiry: Date };
  generateForgetPasswordToken(): { token: string; expiry: Date };
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: userRolesEnum.user,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    verificationExpiry: {
      type: Date,
    },
    refreshTokenExpiry: {
      type: Date,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(
    this.password,
    Number(env.BCRYPT_SALT)
  );
  this.password = hashedPassword;
  next();
});

userSchema.post("save", async function (doc, next) {
  if (doc.verificationToken || doc.isVerified) return next();
  const token = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); //24hrs
  doc.verificationToken = hashedToken;
  doc.verificationExpiry = expiry;
  await doc.save();
  const emailContent = generateVerificationEmail(
    doc.name,
    `${env.VERIFICATION_EMAIL_URL}/${token}`
  );
  console.log(emailContent);
  await sendMail(doc.email, "Verify you email within 24 hours.", emailContent);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); //24hrs
  return { token, hashedToken, expiry };
};

userSchema.methods.generateForgetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  const expiry = 60 * 60 * 1000; //1hr
  return { token, expiry };
};

userSchema.methods.generateAccessToken = function () {
  interface Payload {
    id: string;
    role: string;
  }
  const payload: Payload = { id: this._id, role: this.role };
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY as StringValue,
  });
};
userSchema.methods.generateRefreshToken = function () {
  interface Payload {
    id: string;
    role: string;
  }
  const payload: Payload = { id: this._id, role: this.role };
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY as StringValue,
  });
};
const User = mongoose.model<IUser>("User", userSchema);

export default User;
