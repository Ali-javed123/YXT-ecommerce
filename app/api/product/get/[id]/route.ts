import CategoriesModel from "@/models/categoryModel";
import { catchError } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest,NextResponse } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";

import MediaModel from "@/models/mediaModel";
import ProductModels from "@/models/Product.model";
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const auth = await isAuthenticated(request, "admin");
    await connectDB()

        if(!auth.isAuth){
          return response(false, 401, "Not authorized");
    
        }
        if (!id){
          return response(false, 400, "Invalid or missing field(id)");
    
        }
        //.if exiting or not
    const productExist = await ProductModels.findOne({deletedAt:null,_id:id})
    .populate({path:"media",model:MediaModel,select: "url _id"}).lean();

        if (!productExist){
          return response(false, 400, "invalid id");
    
        }
        const data=productExist
        return response(true,200,"data return successfully",data)
    } catch (error) {
     return   catchError("internal server errror")
    }


    
}