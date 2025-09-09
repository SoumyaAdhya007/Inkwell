import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Post from "../../models/post.models";
import Category from "../../models/category.models";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { generatePostCreatedEmail, sendMail } from "../../utils/mail";
import env from "../../config/env.config";
import { postStatusesEnum, userRolesEnum } from "../../utils/constants";

const slugify = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // collapse multiple -
};
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, category, publicationDate, tags } = req.body;
  const user = req.user;
  const findCategory = await Category.findById(category);
  if (!findCategory) {
    throw new ApiError(400, "Please choose a valid category.");
  }
  const slug = slugify(title);
  // Regex to match: slug OR slug-<number>
  const regex = new RegExp(`^${slug}(-\\d+)?$`, "i");

  const existingSlugs = await Post.find({
    slug: regex,
  });

  const post = await Post.create({
    userId: user._id,
    title,
    content,
    category: findCategory._id,
    slug:
      existingSlugs.length === 0 ? slug : `${slug}-${existingSlugs.length + 1}`, // Use the slug if available; otherwise, append existingSlugs length + 1 to make it unique
    publicationDate,
    tags,
  });
  const emailContent = generatePostCreatedEmail(
    user.name,
    post.title,
    `${env.CREATED_POST_EMAIL_URL}/${user._id}/${post._id}`
  );

  await sendMail(
    user.email,
    "Thanks for submitting! Your blog post is pending approval",
    emailContent
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        "Post created successfully and is now pending approval.",
        post
      )
    );
});

const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find({ status: postStatusesEnum.Approved });
  res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully.", posts));
});

const getUserPostById = asyncHandler(async (req: Request, res: Response) => {
  const { userId, id } = req.params;
  const post = await Post.findOne({ _id: id, userId });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully.", post));
});

const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Posts fetched successfully.", post));
});

const updatePostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  const user = req.user;
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  let updateCondition = false;
  if (user.role === userRolesEnum.admin && !updateCondition) {
    updateCondition = true;
  }

  if (post.status !== postStatusesEnum.Pending && !updateCondition) {
    updateCondition = true;
  }

  if (updateCondition) {
    const findCategory = await Category.findById(category);
    if (!findCategory) {
      throw new ApiError(400, "Please choose a valid category.");
    }

    await Post.findByIdAndUpdate(post._id, {
      title,
      content,
      category: findCategory._id,
      tags,
    });

    res.status(200).json(new ApiResponse(200, "Post updated successfully."));
  } else {
    throw new ApiError(400, "Post cannot be updated until approved by admin.");
  }
});

const deletePostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  let deleteCondition = false;
  if (user.role === userRolesEnum.admin && !deleteCondition) {
    deleteCondition = true;
  }

  if (post.status === postStatusesEnum.Approved && !deleteCondition) {
    deleteCondition = true;
  }

  if (deleteCondition) {
    await Post.findByIdAndDelete(post._id);
    res.status(200).json(new ApiResponse(200, "Post deleted successfully."));
  } else {
    throw new ApiError(400, "Post cannot be deleted until approved by admin.");
  }
});

const checkSlugAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.body;

    const existingSlugs = await Post.find({ slug });

    if (existingSlugs.length > 0) {
      throw new ApiError(409, "Slug already exist.");
    }

    res.status(200).json(new ApiResponse(200, "Slug available."));
  }
);

const updateSlugByPostId = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { slug } = req.body;

  const existingSlugs = await Post.find({ slug });

  if (existingSlugs.length > 0) {
    throw new ApiError(409, "Slug already exist.");
  }

  await Post.findByIdAndUpdate(id, { slug: slugify(slug) });

  res.status(200).json(new ApiResponse(200, "Slug updated successfully."));
});

export {
  createPost,
  getAllPosts,
  getUserPostById,
  getPostById,
  updatePostById,
  deletePostById,
  checkSlugAvailability,
  updateSlugByPostId,
};
