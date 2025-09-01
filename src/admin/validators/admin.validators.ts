import { z } from "zod";

const approvePostByIdValidator = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    reason: z.string().min(1),
  }),
};

const rejectPostByIdValidator = approvePostByIdValidator;

const getPostReviewLogByPostIdValidator = {
  params: z.object({
    id: z.string(),
  }),
};

export {
  approvePostByIdValidator,
  rejectPostByIdValidator,
  getPostReviewLogByPostIdValidator,
};
