
import { connectDB } from "@/lib/databaseConnection";
import { NextRequest } from "next/server";
import { catchError, isAuthenticated } from "@/lib/helperFunctions";
import { response } from "@/lib/helperFunctions";
import { isValidObjectId } from "mongoose";
import MediaModel from "@/models/mediaModel";
export async function GET(request:NextRequest,{params}:any){

    try {
        const auth= await isAuthenticated(request,"admin")
        if(!auth.isAuth){
         return   response(false,403,"Unauthorized")
        }
      await  connectDB()
    const { id } = await params;

      const filter:any={
        deletedAt:null,

      }
      if(!isValidObjectId(id)){
          return  response(false,404,"Invalid object ID")

      }
      filter._id=id
      const getMedia=await MediaModel.findOne(filter).lean()
      if(!getMedia){
          return  response(false,404,"Media not found")

      }
              return    response(true,200,"Media  found",getMedia)




    } catch (error:any) {
        return catchError(error.massege)
    }

}