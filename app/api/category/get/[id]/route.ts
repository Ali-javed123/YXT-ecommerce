import CategoriesModel from "@/models/categoryModel";
import { catchError } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest,NextResponse } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
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

        if(!auth.isAuth){
          return response(false, 401, "Not authorized");
    
        }
        if (!id){
          return response(false, 400, "Invalid or missing field(id)");
    
        }
        //.if exiting or not
    const categoryExist = await CategoriesModel.findById({deletedAt:null,_id:id});

        if (!categoryExist){
          return response(false, 400, "invalid id");
    
        }
        const data=categoryExist
        return response(true,200,"data return successfully",data)
    } catch (error) {
     return   catchError("internal server errror")
    }


    
}