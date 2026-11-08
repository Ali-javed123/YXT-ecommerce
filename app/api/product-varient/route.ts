import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import CategoriesModel from "@/models/categoryModel";
import ProductVaientModel from "@/models/productVarient.model";
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
                {sku:{$regex:globalFilter,$options:'i'}},
                {color:{$regex:globalFilter,$options:'i'}},
                {size:{$regex:globalFilter,$options:'i'}},
                {'productData.name':{$regex:globalFilter,$options:'i'}},
                ...['sellingPrice','discountPercentage','mrp'].map(field=>({
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
            if(["discountPercentage",'mrp','sellingPrice'].includes(e.id)){
                matchQuery[e.id]=Number(e.value)

            }
            else if(e.id==="product"){
                matchQuery[`productData.name`]={$regex:e.value,$options:'i'}

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
            {
                $lookup:{
                from:'products',
                localField:'product',
                foreignField:'_id',
                as:'productData'   
            }
        },
        {
            $unwind:{
                path:"$productData",preserveNullAndEmptyArrays:true
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
                    color:1,
                    mrp:1,
                    sellingPrice:1,
                    descountPrice:1,
                    discountPercentage:1,
                    size:1,
                    sku:1,
                    createdAt:1,
                    updatedAt:1,
                    deletedAt:1,
                }
            }
            
            
        ]

        const getProduct=await ProductVaientModel.aggregate(aggregationPipeLine);
        const totalRowCount=await ProductVaientModel.countDocuments(matchQuery)
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