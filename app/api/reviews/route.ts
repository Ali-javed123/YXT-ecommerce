import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import CategoriesModel from "@/models/categoryModel";
import ProductModels from "@/models/Product.model";
import CouponModels from "@/models/coupon.model";
import next from "next";
import { Niconne } from "next/font/google";
import { NextResponse, type NextRequest } from "next/server";
import RatingModels from "@/models/reviews.model";
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
               
                ...['productData.name','userData.title','rating','review','title'].map(field=>({
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
        filter.forEach((rating:any)=>{
            if(rating.id=="product"){
                matchQuery[`rating.title`]={$regex:rating.value,$options:'i'}

            }else if(rating.id=="user"){
                matchQuery[`user.name`]={$regex:rating.value,$options:'i'}

            }
            else{

                matchQuery[rating.id]={$regex:rating.value,$options:'i'}
            }
            // matchQuery[filter.id]={$regex:filter.value,$options:'i'}
              

        })
        sorting.forEach((sort:any)=>{
            sortQuery[sort.id]=sort.desc?-1:1

        })

        //aggretion pipeline
        const aggregationPipeLine=[
           {
            $lookup:{
                from:'products',
                localField:'products',
                foreignField:'_id',
                as:'productData'
            }
           },
           {
            $unwind:{
                path:'$userData',preserveNullAndEmptyArrays:true
            }
           },
           {
            $lookup:{
                from:'user',
                localField:'user',
                foreignField:'_id',
                as:'userData'
            }
           },
           {
            $unwind:{
                path:'$userData',preserveNullAndEmptyArrays:true
            }
           },
      
            {$match:matchQuery},
            {$sort:Object.keys(sortQuery).length?sortQuery:{createdAt:-1}},
            {$skip:start},
            {$limit:size},
            {
                $project:{
                    _id:1,
                    product:`$productData.name`,
                    user:`$userData.name`,
                    rating:1,
                    review:1,
                    title:1,
                    createdAt:1,
                    updatedAt:1,
                    deletedAt:1,
                }
            }
            
            
        ]

        const getReviews=await RatingModels.aggregate(aggregationPipeLine);
        const totalRowCount=await RatingModels.countDocuments(matchQuery)
        return NextResponse.json({
            success:true,
            data:getReviews,
            meta:{totalRowCount}    

        })

    } catch (error:any) {
  console.error("Reviews API ERROR:", error);

       return catchError(error.massege)
    }





}