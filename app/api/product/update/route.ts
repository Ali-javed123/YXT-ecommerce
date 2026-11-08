import { isAuthenticated } from "@/lib/helperFunctions";
import { NextRequest } from "next/server";
import { response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import ProductModels from "@/models/Product.model";
import { catchError } from "@/lib/helperFunctions";

import { ProdcutSchema } from "@/lib/zodScheema/productSchema";
import z from 'zod'
import { encode } from "node:punycode";
import { isValidObjectId } from "mongoose";

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
await connectDB()
const payload=await request.json()

console.log("Received payload:", payload);

const schema=ProdcutSchema
const isValidate=schema.safeParse(payload)


if(!isValidate.success){
  const errors = isValidate.error.issues.map((issue:any) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return response(false,400,'invalid data or missing fields',errors)
}


    const { name, slug, description, category, mrp, sellingPrice, discountPercentage } =
      isValidate.data;

const { media } = payload
const {_id}=payload

    if (!_id || !isValidObjectId(_id)) {
      return response(false, 400, "Invalid or missing _id");
    }

    const product = await ProductModels.findOne({ _id, deletedAt: null });
    if (!product) {
      console.log("Product not found for _id:", _id);
      return response(false, 404, "Product not found");
    }


    
    const duplicate = await ProductModels.findOne({
      _id: { $ne: _id },
      deletedAt: null,
      $or: [{ name }, { slug }],
    });
    if (duplicate) {
      return response(false, 409, "Product name or slug already exists");
    }

product.name=name
product.slug=slug

product.description=encode( description)
product.category=category

product.discountPercentage=discountPercentage
product.sellingPrice=sellingPrice

product.mrp=mrp
product.media=media



await product.save()

console.log("Product data to save:", product);
return response(true,201,'Product update successfully',product)

}
catch (error: any) {
  console.error("Product API error:", error);

  // Mongoose validation error
  

  // Duplicate key error
  

  return catchError(error);
}

}