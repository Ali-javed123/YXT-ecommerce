import ProductModels from "@/models/Product.model";
import { catchError } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest,NextResponse } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import ProductVaientModel from "@/models/productVarient.model";
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
) {
  try {

    const auth = await isAuthenticated(request, "admin");

        if(!auth.isAuth){
          return response(false, 401, "Not authorized");
    
        }
        
        //.if exiting or not
    // const productVarientsExist = await ProductVaientModel.find({deletedAt:null}).select('-media').sort({createdAt:-1}).lean();
    const productVarientsExist = await ProductVaientModel.find({ deletedAt: null })
      .select("-media -__v")
      .populate({ path: "product", model: ProductModels, select: "name" })
      .sort({ createdAt: -1 })
      .lean();

if(!productVarientsExist){
          return response(false, 401, "data not found, collection empty");
    
        }
            const formatted = productVarientsExist.map((v: any) => ({
      _id: String(v._id),
      product: v.product?.name ?? "",
      color: v.color,
      size: v.size ?? "",
      mrp: v.mrp,
      sku: v.sku,
      sellingPrice: v.sellingPrice,
      discountPercentage: v.discountPercentage,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));

        return response(true, 200, "Data Found! ",formatted)
       
    } catch (error) {
     return   catchError("internal server errror")
    }


    
}