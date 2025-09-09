import { z } from "zod";
import mongoose from "mongoose";
const ObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });
const createPostValidator = {
  body: z.object({
    title: z.string().min(3).max(50),
    content: z.string().min(10),
    category: z.string(),
    publicationDate: z.date().optional(),
    tags: z.array(z.string()).min(1),
  }),
};

const getUserPostByIdValidator = {
  params: z.object({
    userId: z.string(),
    id: z.string(),
  }),
};
const getPostByIdValidator = {
  params: z.object({
    id: z.string(),
  }),
};

const updatePostByIdValidator = {
  params: getPostByIdValidator.params.pick({ id: true }),
  body: createPostValidator.body.pick({
    title: true,
    content: true,
    category: true,
    tags: true,
  }),
};

const deletePostByIdValidator = getPostByIdValidator;

const checkSlugAvailabilityValidator = {
  body: z.object({
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens (no spaces or special characters).",
      })
      .min(3, { message: "Slug must be at least 3 characters long." })
      .max(100, { message: "Slug must not exceed 100 characters." }),
  }),
};

const updateSlugByPostIdValidator = {
  params: getPostByIdValidator.params.pick({ id: true }),
  body: checkSlugAvailabilityValidator.body.pick({ slug: true }),
};
export {
  createPostValidator,
  getUserPostByIdValidator,
  getPostByIdValidator,
  updatePostByIdValidator,
  deletePostByIdValidator,
  checkSlugAvailabilityValidator,
  updateSlugByPostIdValidator,
};
