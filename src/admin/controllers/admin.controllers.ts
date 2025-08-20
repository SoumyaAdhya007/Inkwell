import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Category from "../../models/category.models";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import Post from "../../models/post.models";
import { postStatusesEnum } from "../../utils/constants";
import {
  generatePostAcceptedEmail,
  generatePostRejectedEmail,
  sendMail,
} from "../../utils/mail";
import { IUser } from "../../models/user.models";
import env from "../../config/env.config";

const getAllPendingPosts = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Post.find({ status: postStatusesEnum.Pending });
  res
    .status(200)
    .json(new ApiResponse(200, "Categories fetched successfully.", categories));
});

const approvePostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate<{ userId: IUser }>("userId");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const postUser = post.userId;
  await Post.findByIdAndUpdate(post._id, { status: postStatusesEnum.Approved });

  const emailContent = generatePostAcceptedEmail(
    postUser.name,
    post.title,
    `${env.CREATED_POST_EMAIL_URL}/${postUser._id}/${post._id}`
  );

  await sendMail(
    postUser.email,
    "Your blog post has been approved and published!",
    emailContent
  );
  res.status(200).json(new ApiResponse(200, "Post approved by admin.", post));
});
const rejectPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate<{ userId: IUser }>("userId");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const postUser = post.userId;
  await Post.findByIdAndUpdate(post._id, { status: postStatusesEnum.Rejected });

  const emailContent = generatePostRejectedEmail(postUser.name, post.title);

  await sendMail(
    postUser.email,
    "Your blog post was not approved this time",
    emailContent
  );
  res.status(200).json(new ApiResponse(200, "Post rejected by admin."));
});

export { getAllPendingPosts, approvePostById, rejectPostById };
