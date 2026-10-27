import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import { CategorySchema } from "@/lib/zodScheema/category";
import CategoriesModel from "@/models/categoryModel";
import { catchError } from "@/lib/helperFunctions";

export async function POST (request:NextRequest){
try {
    const auth=await isAuthenticated(request,"admin");
if(!auth.isAuth){
return response(false,401,'unauthourized')
}
connectDB()
const payload=await request.json()

console.log("Received payload:", payload);

const schema=CategorySchema
const isValidate=schema.safeParse(payload)
if(!isValidate.success){
  const errors = isValidate.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return response(false,400,'invalid data or missing fields',errors)
}


const {name,slug}=isValidate.data
const isNameExist=await CategoriesModel.findOne({name})
const isSlug=await CategoriesModel.findOne({slug})
if(isNameExist){
return response(false,400,'name is already exist!')

}
if(isSlug){
return response(false,400,'slug is already exist!')

}
const newCategory= new CategoriesModel({name,slug})
console.log("Category document:", newCategory.toObject());

await newCategory.save()

console.log("Media data to save:", newCategory);
return response(true,201,'category create successfully')

}
catch (error: any) {
  console.error("Category API error:", error);

  // Mongoose validation error
  if (error?.name === "ValidationError") {
    const errors = Object.values(error.errors).map(
      (err: any) => ({
        field: err.path,
        message: err.message,
      })
    );

    return response(
      false,
      400,
      "Category validation failed",
      errors
    );
  }

  // Duplicate key error
  if (error?.code === 11000) {
    const field = Object.keys(
      error.keyPattern ?? {}
    )[0];

    return response(
      false,
      409,
      `${field ?? "Field"} already exists`,
      [
        {
          field: field ?? "unknown",
          message: `${field ?? "Field"} must be unique`,
        },
      ]
    );
  }

  return catchError(error);
}

}