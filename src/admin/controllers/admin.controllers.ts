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
import PostReviewLog from "../../models/postReviewLog.models";

const getAllPendingPosts = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Post.find({ status: postStatusesEnum.Pending });
  res
    .status(200)
    .json(new ApiResponse(200, "Categories fetched successfully.", categories));
});

const approvePostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = req.user;
  const post = await Post.findById(id).populate<{ userId: IUser }>({
    path: "userId",
    select: "_id name email",
  });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.status === postStatusesEnum.Approved) {
    throw new ApiError(400, "This post has already been approved");
  }

  const postUser = post.userId;
  await Post.findByIdAndUpdate(post._id, { status: postStatusesEnum.Approved });

  const emailContent = generatePostAcceptedEmail(
    postUser.name,
    post.title,
    `${env.CREATED_POST_EMAIL_URL}/user/${postUser._id}/${post._id}`
  );

  const postReviewLog = await PostReviewLog.create({
    postId: post._id,
    postBy: postUser._id,
    reviewedBy: user._id,
    status: postStatusesEnum.Approved,
    reason,
  });

  await sendMail(
    postUser.email,
    "Your blog post has been approved and published!",
    emailContent
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, "Post approved by admin.", { post, postReviewLog })
    );
});

const rejectPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = req.user;

  const post = await Post.findById(id).populate<{ userId: IUser }>({
    path: "userId",
    select: "_id name email",
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.status === postStatusesEnum.Rejected) {
    throw new ApiError(400, "This post has already been rejected");
  }

  const postUser = post.userId;
  await Post.findByIdAndUpdate(post._id, { status: postStatusesEnum.Rejected });

  const postReviewLog = await PostReviewLog.create({
    postId: post._id,
    postBy: postUser._id,
    reviewedBy: user._id,
    status: postStatusesEnum.Rejected,
    reason,
  });

  const emailContent = generatePostRejectedEmail(
    postUser.name,
    post.title,
    postReviewLog.reason
  );

  await sendMail(
    postUser.email,
    "Your blog post was not approved this time",
    emailContent
  );
  res
    .status(200)
    .json(
      new ApiResponse(200, "Post rejected by admin.", { post, postReviewLog })
    );
});

const getAllPostReviewLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const postReviewLogs = await PostReviewLog.find({})
      .populate({
        path: "postId",
      })
      .populate({
        path: "postBy",
        select: "_id name email",
      })
      .populate({
        path: "reviewedBy",
        select: "_id name email",
      });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Post review logs fetched successfully.",
          postReviewLogs
        )
      );
  }
);

const getPostReviewLogByPostId = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const postReviewLog = await PostReviewLog.find({ postId: id })
      .populate({
        path: "postId",
      })
      .populate({
        path: "postBy",
        select: "_id name email",
      })
      .populate({
        path: "reviewedBy",
        select: "_id name email",
      });

    if (!postReviewLog) {
      throw new ApiError(404, "Post review logs not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Post review logs fetched successfully.",
          postReviewLog
        )
      );
  }
);

export {
  getAllPendingPosts,
  approvePostById,
  rejectPostById,
  getAllPostReviewLogs,
  getPostReviewLogByPostId,
};
