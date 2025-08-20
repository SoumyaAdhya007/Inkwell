import mongoose, { Document } from "mongoose";
interface ICategory extends Document {
  category: string;
  userId: mongoose.Schema.Types.ObjectId;
}
const categorySchema = new mongoose.Schema<ICategory>(
  {
    category: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
