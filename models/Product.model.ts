  import mongoose from "mongoose";

  const ProductModel = new mongoose.Schema(
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
        lowercase:true
        // unique:true,
      
      },
      category:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Category",
  required:true
      },

        mrp: {
        type: Number,
        required: true,
        // unique:true,
      
      },

    sellingPrice: {
        type: Number,
        required: true,
        // unique:true,
      
      },

      // descountPrice: {
      //   type: Number,
      //   required: true,
      //   // unique:true,
      
      // },
      discountPercentage: {
        type: Number,
        required: true,
        // unique:true,
      
      },
      media:[
              {
          type:mongoose.Schema.Types.ObjectId,
          ref:"media",
        required: true,
        // unique:true,
      
      },


      ],


      description: {
        type: String,
        required: true,
        trim:true

        // unique:true,
      
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
  ProductModel.index({category:1})

  const ProductModels =
    mongoose.models.Product ||
    mongoose.model("Product", ProductModel, "products");

  export default ProductModels;
