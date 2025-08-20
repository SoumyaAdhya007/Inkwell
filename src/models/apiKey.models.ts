import mongoose, { Date, Document } from "mongoose";
import {
  apikeyStatusesEnum,
  AvailableApiKeyStatuses,
} from "../utils/constants";

interface IApiKey extends Document {
  userId: mongoose.Schema.Types.ObjectId;

  name: string;
  description?: string;
  key: string;
  status: string;
  keyExpiry: Date;
  limit: number;
  useCount: number;
  lastUsed?: number;
  revokedAt?: Date;
}
const apikeySchema = new mongoose.Schema<IApiKey>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      default: "My API Key",
    },
    description: {
      type: String,
    },
    key: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: AvailableApiKeyStatuses,
      default: apikeyStatusesEnum.Active,
    },
    keyExpiry: {
      type: Date,
      required: true,
    },
    limit: {
      type: Number,
      default: 1000,
    },
    useCount: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
    revokedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ApiKey = mongoose.model<IApiKey>("ApiKey", apikeySchema);

export default ApiKey;
