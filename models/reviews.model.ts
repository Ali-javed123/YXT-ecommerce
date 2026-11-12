import mongoose from "mongoose";

const ReviewsModel = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    user: {
      type: Number,
      required: true,

    },
        title: {
      type: String,
      required: true,
      trim: true,
      // unique:true,
    
    //   lowercase:true
    },
    rating: {
      type: String,
      required: true,
      trim: true,
      // unique:true,
    
    //   lowercase:true
    },
    review: {
      type: String,
      required: true,
      trim: true,
      // unique:true,
    
    //   lowercase:true
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

const RatingModels =
  mongoose.models.reviews ||
  mongoose.model("reviews", ReviewsModel, "reviews");

export default RatingModels;
