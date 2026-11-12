import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import { CategorySchema } from "@/lib/zodScheema/category";
import CouponModels from "@/models/coupon.model";
import { catchError } from "@/lib/helperFunctions";
import { CouponsSchema } from "@/lib/zodScheema/coupons.schema";
export async function POST (request:NextRequest){
try {
    const auth=await isAuthenticated(request,"admin");
if(!auth.isAuth){
return response(false,401,'unauthourized')
}
connectDB()
const payload=await request.json()

console.log("Received payload:", payload);

const schema=CouponsSchema
const isValidate=schema.safeParse(payload)
if(!isValidate.success){
  const errors = isValidate.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return response(false,400,'invalid data or missing fields',errors)
}


const {discountPercentage,code,minShoppingAmount,validity}=isValidate.data
const isNameExist=await CouponModels.findOne({code})
if(isNameExist){
return response(false,400,'code is already exist!')

}

const newCoupon= new CouponModels({code,discountPercentage,minShoppingAmount,validity})
console.log("Coupon document:", newCoupon.toObject());

await newCoupon.save()

console.log("Media data to save:", newCoupon);
return response(true,201,'coupon create successfully')

}
catch (error: any) {
  console.error("coupon API error:", error);

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