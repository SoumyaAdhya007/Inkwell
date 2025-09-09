import mongoose, { Document } from "mongoose";
import { AvailablePostStatuses, postStatusesEnum } from "../utils/constants";

interface IPost extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  category: mongoose.Schema.Types.ObjectId;
  slug: string;
  publicationDate: Date;
  tags: [string];
  status: string;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      minLength: 3,
      maxLength: 50,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    publicationDate: {
      type: Date,
      default: Date.now,
      require: true,
    },
    tags: [
      {
        type: String,
        require: true,
      },
    ],
    status: {
      type: String,
      enum: AvailablePostStatuses,
      default: postStatusesEnum.Pending,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
