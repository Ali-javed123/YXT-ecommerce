import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import ProductModels from "@/models/Product.model";
import { catchError } from "@/lib/helperFunctions";

import { ProdcutSchema } from "@/lib/zodScheema/productSchema";
import { ProdcutVariantUpdateSchema } from "@/lib/zodScheema/product-varient.schema";
import z from 'zod'
import { encode } from "node:punycode";
import { isValidObjectId } from "mongoose";
import ProductVaientModel from "@/models/productVarient.model";

export async function PUT (request:NextRequest){
try {
    const auth=await isAuthenticated(request,"admin");
if(!auth.isAuth){
return response(false,401,'unauthourized')
}
await connectDB()
const payload=await request.json()

console.log("Received payload:", payload);

const schema=ProdcutVariantUpdateSchema
const isValidate=schema.safeParse(payload)


if(!isValidate.success){
  const errors = isValidate.error.issues.map((issue:any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return response(false,400,'invalid data or missing fields',errors)
}


    const { product,color,sku,mrp,sellingPrice,discountPercentage,size} =
      isValidate.data;

const { media } = payload
const {_id}=payload

    if (!_id || !isValidObjectId(_id)) {
      return response(false, 400, "Invalid or missing _id");
    }

    const productExist = await ProductVaientModel.findOne({ _id, deletedAt: null });
    if (!productExist) {
      console.log("Product not found for _id:", _id);
      return response(false, 404, "Product not found");
    }


    
    const duplicate = await ProductVaientModel.findOne({
      _id: { $ne: _id },
      deletedAt: null,
     
    });
    // if (duplicate) {
    //   return response(false, 409, "Product name or slug already exists");
    // }

productExist.color=color

productExist.product=product

productExist.sku=sku
productExist.size=size
productExist.sellingPrice=sellingPrice

productExist.mrp=mrp
productExist.discountPercentage=discountPercentage
productExist.media=media



await productExist.save()

console.log("product Varient data to save:", productExist);
return response(true,200,'Product update successfully',product)

}
catch (error: any) {
  console.error("Product API error:", error);

  // Mongoose validation error
  

  // Duplicate key error
  

  return catchError(error);
}

}