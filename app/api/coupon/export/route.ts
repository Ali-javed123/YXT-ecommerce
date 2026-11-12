import CouponModels from "@/models/coupon.model";
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
) {
  try {

    const auth = await isAuthenticated(request, "admin");

        if(!auth.isAuth){
          return response(false, 401, "Not authorized");
    
        }
        
        //.if exiting or not
    const couponExist = await CouponModels.find({daletedAt:null}).sort({createdAt:-1}).lean();
if(!couponExist){
          return response(false, 401, "data not found, collection empty");
    
        }
        return response(true, 200, "Data Found! ",couponExist)
       
    } catch (error) {
     return   catchError("internal server errror")
    }


    
}