import UsersModel from "@/models/user.models";
import { response, catchError, generateOTP } from "@/lib/helperFunctions";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/databaseConnection";
import { isValidObjectId } from "mongoose";
import { otpSchema } from "@/lib/zodScheema/zosScheema";
import OtpModal from "@/lib/zodScheema/otpModals";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/lib/otpEmail";

interface JwtPayload {
    userId: string;
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const payload=await request.json()
        const validateSchema=otpSchema.pick({email:true})
        const validateData=validateSchema.safeParse(payload)
        if(!payload){
            return response(false,401,'invalid or missing field',validateData.error)
        }
        const {email}=validateData.data as any

        const getUser=await UsersModel.findOne({deletedAt:null,email}).lean()
        if(!getUser){
            return response(false,401,"User not found!." )
            
        }
        await OtpModal.deleteMany({email})
        const otp=generateOTP()
        const newOtpData=await new OtpModal({
            email,
            otp
        })
        await newOtpData.save()
        
        const sendMailStatus=await sendMail(
            email,
            'your login verification code',
            otpEmail(otp)
        )
        if(!sendMailStatus){
            return response(false,400,"Field to resend otp!." )

        }
        return response(true,200,'otp sent successfully ')

    } catch (error) {
        console.error("Verify Email Error:", error);

        return catchError(error);
    }
}