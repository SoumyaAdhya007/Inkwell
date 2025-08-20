import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Category from "../../models/category.models";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.body;
  const userId = req.user._id;
  const findCategory = await Category.findOne({ category });
  if (findCategory) {
    throw new ApiError(400, "Category exists.");
  }
  const newCategory = await Category.create({
    category,
    userId,
  });
  res
    .status(201)
    .json(
      new ApiResponse(201, "New category created successfully.", newCategory)
    );
});

const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({});
  res
    .status(200)
    .json(new ApiResponse(200, "Categories fetched successfully.", categories));
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Category fetched successfully.", category));
});

const updateCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category } = req.body;
  const updateCategory = await Category.findByIdAndUpdate(id, {
    category,
  });

  if (!updateCategory) {
    throw new ApiError(404, "Category not found.");
  }

  res.status(200).json(new ApiResponse(200, "Category updated successfully."));
});

const deleteCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  res.status(204).json(new ApiResponse(204, "Category deleted successfully."));
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
