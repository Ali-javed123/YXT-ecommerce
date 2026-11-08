  import mongoose from "mongoose";

  const ProductVaient = new mongoose.Schema(
    
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true

        },
      color: {
        type: String,
        required: true,
        trim: true,
        // unique:true
      },
        size: {
        type: String,
        trim: true,
        // unique:true,
      
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
      sku:{
        type:String,
        required:true,
        unique:true
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


      
      deletedAt: {
        type: Date,
        default: null,
        index: true,
      }
      
    
    },
    { timestamps: true }
  );

  // ✅ Model naam aur collection naam "media" hona chahiye, "OTP"/"otp" nahi
  ProductVaient.index({product:1})

  const ProductVaientModel =
    mongoose.models.ProductVarient ||
    mongoose.model("productsvariant", ProductVaient, "productsvariants");

  export default ProductVaientModel;
