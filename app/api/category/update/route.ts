import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import CategoriesModel from "@/models/categoryModel";
import { catchError } from "@/lib/helperFunctions";
import z from 'zod'

const categorySchema=z.object({
  slug: z.string().trim().min(1, "slug is required!"),
  name: z.string().trim().min(1, "name is required!"),
  _id: z.string().trim().min(1, "_id is required!")

})
export async function PUT (request:NextRequest){
try {
    const auth=await isAuthenticated(request,"admin");
if(!auth.isAuth){
return response(false,401,'unauthourized')
}
connectDB()
const payload=await request.json()

console.log("Received payload:", payload);

const schema=categorySchema
const isValidate=schema.safeParse(payload)
if(!isValidate.success){
  const errors = isValidate.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return response(false,400,'invalid data or missing fields',errors)
}


const {name,slug,_id}=isValidate.data
const isNameExist=await CategoriesModel.findOne({name})
const isId=await CategoriesModel.findOne({_id})
const isSlug=await CategoriesModel.findOne({slug})


isId.name=name
isId.slug=slug



await isId.save()

console.log("Media data to save:", isId);
return response(true,201,'category create successfully')

}
catch (error: any) {
  console.error("Category API error:", error);

  // Mongoose validation error
  

  // Duplicate key error
  

  return catchError(error);
}

}