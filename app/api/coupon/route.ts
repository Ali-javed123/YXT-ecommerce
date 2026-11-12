import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import CategoriesModel from "@/models/categoryModel";
import ProductModels from "@/models/Product.model";
import CouponModels from "@/models/coupon.model";
import next from "next";
import { Niconne } from "next/font/google";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request:NextRequest){
    try {
        
        const auth=await isAuthenticated(request,'admin')
        if(!auth.isAuth){
          return  response(false,402,"Unauthroized!")
        }
        await connectDB()

        const searchParams=request.nextUrl.searchParams;

        //extract query parameter
        const start = Number(searchParams.get("start") || 0)
        const size = Number(searchParams.get("size") || 10)
        const filter=JSON.parse(searchParams.get('filters')||'[]')
        const globalFilter=searchParams.get('globalFilter')||''
        const sorting=JSON.parse(searchParams.get('sorting')||'[]')
        const deleteType = searchParams.get('deleteType')
        
        //muild match logic
        let matchQuery:any={}
        let sortQuery:any={}

        if (deleteType === "SD") {
    matchQuery = { deletedAt: null }
} else if (deleteType === "PD") {
    matchQuery = { deletedAt: { $ne: null } }
}
        if(globalFilter){
            matchQuery['$or']=[
                {code:{$regex:globalFilter,$options:'i'}},
               
                ...['discountPercentage','minShoppingAmount'].map(field=>({
                    $expr:{
                        $regexMatch:{
                        input: { $toString: `$${field}` },
                            regex:globalFilter,
                            options:'i'
                        }
                    }

                })),
                 
                
                
            ]
        }
        filter.forEach((e:any)=>{
            if(["discountPercentage",'minShoppingAmount'].includes(e.id)){
                matchQuery[e.id]=Number(e.value)

            }
            else if(e.id==="validity"){
                matchQuery[e.id]=new Date(e.value)

            }
            else{
                matchQuery[e.id]={$regex:e.value,$options:'i'}

            }
            // matchQuery[filter.id]={$regex:filter.value,$options:'i'}
              

        })
        sorting.forEach((sort:any)=>{
            sortQuery[sort.id]=sort.desc?-1:1

        })

        //aggretion pipeline
        const aggregationPipeLine=[
           
      
            {$match:matchQuery},
            {$sort:Object.keys(sortQuery).length?sortQuery:{createdAt:-1}},
            {$skip:start},
            {$limit:size},
            {
                $project:{
                    _id:1,
                    code:1,
                    minShoppingAmount:1,
                    validity:1,
                    discountPercentage:1,
                  
                    createdAt:1,
                    updatedAt:1,
                    deletedAt:1,
                }
            }
            
            
        ]

        const getProduct=await CouponModels.aggregate(aggregationPipeLine);
        const totalRowCount=await CouponModels.countDocuments(matchQuery)
        return NextResponse.json({
            success:true,
            data:getProduct,
            meta:{totalRowCount}    

        })

    } catch (error:any) {
  console.error("CATEGORY API ERROR:", error);

       return catchError(error.massege)
    }





}