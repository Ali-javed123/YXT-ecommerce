import mongoose from "mongoose";

const CategoryModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      // unique:true
    },
       slug: {
      type: String,
      required: true,
      trim: true,
      // unique:true,
    
      lowercase:true
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    }
    
  
  },
  { timestamps: true }
);

// ✅ Model naam aur collection naam "media" hona chahiye, "OTP"/"otp" nahi

const CategoriesModel =
  mongoose.models.Catgeory ||
  mongoose.model("Catgeory", CategoryModel, "categories");

export default CategoriesModel;
