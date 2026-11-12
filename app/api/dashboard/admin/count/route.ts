import { connectDB } from "@/lib/databaseConnection";
import { isAuthenticated, response } from "@/lib/helperFunctions";
import type{ NextRequest } from "next/server";
import type{ NextResponse } from "next/server";

import { catchError } from "@/lib/helperFunctions";
import CategoriesModel from "@/models/categoryModel";
import ProductModels from "@/models/Product.model";
import UsersModel from "@/models/user.model";
export async function GET(request:NextRequest,res:NextResponse){
    try {
        const auth = await isAuthenticated(request,'admin')
        if(!auth.isAuth){
            return response(false,403,'Unauthorized')
        }
        await connectDB()
        const [category,product,customer]=await Promise.all([
            CategoriesModel.countDocuments({deleteAt:null}),
            ProductModels.countDocuments({deleteAt:null}),
            UsersModel.countDocuments({deleteAt:null}),
        ])
        const reponse= {
            category,
            product,
            customer
        }
        return response(true,200,'dasboard count found',reponse)

        
    } catch (error) {
        catchError(error)
    }
}