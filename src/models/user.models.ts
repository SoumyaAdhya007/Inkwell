import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userRolesEnum, AvailableUserRoles } from "../utils/constants";
import env from "../config/env.config.js";

const userSchema = new mongoose.Schema(
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
  const hashedPassword = await bcrypt.hash(this.password, env.BCRYPT_SALT);
  this.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  const expiry = 24 * 60 * 60 * 1000; //24hrs
  return { token, expiry };
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
    expiresIn: Number(env.ACCESS_TOKEN_EXPIRY),
  });
};
userSchema.methods.generateRefreshToken = function () {
  interface Payload {
    id: string;
    role: string;
  }
  const payload: Payload = { id: this._id, role: this.role };
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: Number(env.REFRESH_TOKEN_EXPIRY),
  });
};
const User = mongoose.model("user", userSchema);

export default User;
