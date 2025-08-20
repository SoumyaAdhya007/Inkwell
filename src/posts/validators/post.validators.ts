import { z } from "zod";
import mongoose from "mongoose";
const ObjectId = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });
const createPostValidator = {
  body: z.object({
    title: z.string().min(3),
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
export {
  createPostValidator,
  getUserPostByIdValidator,
  getPostByIdValidator,
  updatePostByIdValidator,
  deletePostByIdValidator,
};
