import { z } from "zod";

const approvePostByIdValidator = {
  params: z.object({
    id: z.string(),
  }),
};
const rejectPostByIdValidator = approvePostByIdValidator;

export { approvePostByIdValidator, rejectPostByIdValidator };
