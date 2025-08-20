import { z } from "zod";

const createCategoryValidator = {
  body: z.object({
    category: z.string().min(3).toLowerCase(),
  }),
};

const getCategoryByIdValidator = {
  params: z.object({
    id: z.string(),
  }),
};

const updateCategoryByIdValidator = {
  params: getCategoryByIdValidator.params.pick({ id: true }),
  body: createCategoryValidator.body.pick({
    category: true,
  }),
};

const deleteCategoryByIdValidator = getCategoryByIdValidator;
export {
  createCategoryValidator,
  getCategoryByIdValidator,
  updateCategoryByIdValidator,
  deleteCategoryByIdValidator,
};
