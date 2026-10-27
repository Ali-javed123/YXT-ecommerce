// import { connectDB } from "@/lib/databaseConnection";
// import { isAuthenticated, response } from "@/lib/helperFunctions";
// import { catchError } from "@/lib/helperFunctions";
// import MediaModel from "@/models/mediaModel";
// import { NextRequest, NextResponse } from "next/server";



// export async function GET(request:NextRequest){
// try {
//     const auth=await isAuthenticated("admin")
//     if(!auth.isAuth){
//         return response (false,403,'Unauthorized')
//     }
//     await connectDB()
//     const searchParams=request.nextUrl.searchParams
//     const page=parseInt(searchParams.get('page') ??"",10) || 0
//     const limit=parseInt(searchParams.get('limit') ??"",10) || 0
//     // SD =>restore Soft delete //RSD=>restore soft delete// PD=> Permenent delete
//     const deletedType=searchParams.get('deleteType')
//     let filter={}
//     if(deletedType==="SD"){
// filter={deletedAt:null}
//     }else if(deletedType==="PD"){
// filter={deletedAt:{$ne:null}}

        
//     }
//     const mediaData=await MediaModel.find(filter).sort({createdAt:-1}).skip(page*limit).limit(limit).lean()
//     const totalMedia=await MediaModel.countDocuments(filter)
//     return  NextResponse.json({
//         mediaData,
//         hasMore:((page+1)*limit) <totalMedia
//     })

// } catch (error) {
//     catchError(error)
// }
// }
import { connectDB } from "@/lib/databaseConnection"
import {
  isAuthenticated,
  response,
  catchError,
} from "@/lib/helperFunctions"
import MediaModel from "@/models/mediaModel"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = await isAuthenticated( request,"admin")

    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized")
    }

    await connectDB()

    const searchParams = request.nextUrl.searchParams

    const page =
      parseInt(searchParams.get("page") ?? "", 10) || 0

    const limit =
      parseInt(searchParams.get("limit") ?? "", 10) || 10

    const deleteType =
      searchParams.get("deleteType")

    let filter = {}

    if (deleteType === "SD") {
      filter = {
        deletedAt: null,
      }
    } else if (deleteType === "PD") {
      filter = {
      deletedAt: {
          $ne: null,
        },
      }
    }

    const mediaData = await MediaModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean()

    const totalMedia =
      await MediaModel.countDocuments(filter)

    return NextResponse.json({
      mediaData,
      hasMore: (page + 1) * limit < totalMedia,
    })

  } catch (error) {
    return catchError(error)
  }
}