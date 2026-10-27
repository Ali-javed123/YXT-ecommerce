
import { connectDB } from "@/lib/databaseConnection";
import { NextRequest } from "next/server";
import { catchError, isAuthenticated } from "@/lib/helperFunctions";
import { response } from "@/lib/helperFunctions";
import { isValidObjectId } from "mongoose";
import MediaModel from "@/models/mediaModel";
import z from "zod";

type Media={
    alt?:string
    title?:string
    image?:any
    id?:String
}

export async function PUT(request:NextRequest,{params}:any){

    try {
        const auth= await isAuthenticated(request,"admin")
        if(!auth.isAuth){
         return   response(false,403,"Unauthorized")
        }
      await  connectDB()

      const payload=await request.json()


const schema = z.object({
    _id:z.string().trim().min(1, "Alt is required"),
  alt: z.string().trim().min(1, "Alt is required"),
  title: z.string().trim().min(1, "Title is required"),
});

const validate=schema.safeParse(payload)

if(!validate.success){
   return response(false,400,"Invalid or missing fields")
}
const {alt,title,image,_id}:any= validate.data

      
      if(!isValidObjectId(_id)){
          return  response(false,404,"Invalid object ID")

      }
      const getMedia=await MediaModel.findById(_id)

      if(!getMedia){
          return  response(false,404,"Media not found")

      }
      getMedia.title=title
      getMedia.alt=alt

      getMedia.save()


      
      
              return    response(true,200,"Media  found",getMedia)




    } catch (error:any) {
        return catchError(error.massege)
    }

}