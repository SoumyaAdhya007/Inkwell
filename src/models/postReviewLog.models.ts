import mongoose, { Document } from "mongoose";
import { AvailablePostStatuses } from "../utils/constants";
interface IPostReviewLogSchema extends Document {
  postId: mongoose.Schema.Types.ObjectId;
  postBy: mongoose.Schema.Types.ObjectId;
  reviewedBy: mongoose.Schema.Types.ObjectId;
  status: string;
  reason: string;
  timestamp: Date;
}
const postReviewLogSchema = new mongoose.Schema<IPostReviewLogSchema>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    postBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: AvailablePostStatuses,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PostReviewLog = mongoose.model<IPostReviewLogSchema>(
  "PostReviewLog",
  postReviewLogSchema
);

export default PostReviewLog;
