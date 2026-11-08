import mongoose from "mongoose";

const CouponModel = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
       discountPercentage: {
      type: Number,
      required: true,
      trim: true,
      // unique:true,
    
    //   lowercase:true
    },
    minShoppingAmount: {
      type: Number,
      required: true,
      trim: true,
      // unique:true,
    
    //   lowercase:true
    },
    validity: {
      type: Date,
      required: true,
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

const CouponModels =
  mongoose.models.coupon ||
  mongoose.model("coupon", CouponModel, "coupons");

export default CouponModels;
