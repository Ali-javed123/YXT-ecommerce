import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunctions";
import { catchError } from "@/lib/helperFunctions";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
export async function POST(){
try {
    await connectDB()
    const cookieStore=await cookies()
    cookieStore.delete('access-token')
    return response(true ,200, 'Logout successful')
} catch (error:any) {
   return catchError(error)
    
}
}