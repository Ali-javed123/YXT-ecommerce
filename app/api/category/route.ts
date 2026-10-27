import { connectDB } from "@/lib/databaseConnection";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import CategoriesModel from "@/models/categoryModel";
import next from "next";
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
                {name:{$regex:globalFilter,$options:'i'}},
                {slug:{$regex:globalFilter,$options:'i'}},
            ]
        }
        filter.forEach((e:any)=>{
            // matchQuery[filter.id]={$regex:filter.value,$options:'i'}
                matchQuery[e.id] = {
        $regex: e.value,
        $options: 'i'
    }

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
                    name:1,
                    slug:1,
                    createdAt:1,
                    updatedAt:1,
                    deletedAt:1,
                }
            }
            
            
        ]

        const getCatgory=await CategoriesModel.aggregate(aggregationPipeLine);
        const totalRowCount=await CategoriesModel.countDocuments(matchQuery)
        return NextResponse.json({
            data:getCatgory,
            meta:{totalRowCount}    

        })

    } catch (error:any) {
  console.error("CATEGORY API ERROR:", error);

       return catchError(error.massege)
    }





}