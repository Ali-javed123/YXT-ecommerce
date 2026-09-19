import UsersModel from "@/models/user.models";
import { response, catchError } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import { otpSchema } from "@/lib/zodScheema/zosScheema";
import OtpModal from "@/lib/zodScheema/otpModals";
import { createToken } from "@/lib/tokenGenerate";
interface JwtPayload {
    userId: string;
}


export async function POST (request: Request) {
    console.log("request",request)
    try {
        await connectDB();
        const payload=await request.json()
        const validateSchema = otpSchema.safeParse(payload)

        if(!validateSchema.success){
            return response(false,401,"Invalid or missing input fields.", validateSchema.error )

        }
        const {otp,email}=validateSchema.data
        const getOtpData=await OtpModal.findOne({email,otp})
        if(!getOtpData){
            return response(false,401,"Invalid or expired otp." )
            
        }

        const getUser=await UsersModel.findOne({deletedAt:null,email}).lean()
        if(!getUser){
            return response(false,401,"User not found!." )
            
        }
        
        await getOtpData.deleteOne()
        return response(true ,200,'OTP Verified.')

    } catch (error) {
        console.error("Verify Email Error:", error);

        return catchError(error);
    }
}