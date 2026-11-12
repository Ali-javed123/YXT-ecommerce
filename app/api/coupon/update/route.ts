import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import CategoriesModel from "@/models/categoryModel";
import { catchError } from "@/lib/helperFunctions";
import z from 'zod'
import { UpdateCouponsSchema } from "@/lib/zodScheema/coupons.schema";
import CouponModels from "@/models/coupon.model";
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

const schema=UpdateCouponsSchema
const isValidate=schema.safeParse(payload)
if(!isValidate.success){
  const errors = isValidate.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return response(false,400,'invalid data or missing fields',errors)
}


const {code,validity,minShoppingAmount,discountPercentage,_id}=isValidate.data
const isCodeExist=await CouponModels.findOne({code})

isCodeExist.code=code
isCodeExist.validity=validity
isCodeExist.minShoppingAmount=minShoppingAmount
isCodeExist.discountPercentage=discountPercentage
isCodeExist._id=_id


await isCodeExist.save()

console.log("Coupon data to save:", isCodeExist);
return response(true,201,'Coupon update successfully',isCodeExist)

}
catch (error: any) {
  console.error("Coupon API error:", error);

  // Mongoose validation error
  

  // Duplicate key error
  

  return catchError(error);
}

}