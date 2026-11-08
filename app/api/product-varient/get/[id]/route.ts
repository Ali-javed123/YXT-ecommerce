import CategoriesModel from "@/models/categoryModel";
import { catchError } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest,NextResponse } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";

import MediaModel from "@/models/mediaModel";
import ProductVaientModel from "@/models/productVarient.model";
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
    const productVarientExist = await ProductVaientModel.findOne({deletedAt:null,_id:id})
    .populate({path:"media",model:MediaModel,select: "url _id"}).lean();

        if (!productVarientExist){
          return response(false, 400, "invalid id");
    
        }
        const data=productVarientExist
        return response(true,200,"data return successfully",data)
    } catch (error:any) {
        console.error("PRODUCT VARIANT GET ERROR:", error);

     return   catchError(error)
    }


    
}