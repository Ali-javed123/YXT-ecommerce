import UsersModel from "@/models/user.model";
import { response, catchError } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import { otpSchema } from "@/lib/zodScheema/zosScheema";
import OtpModal from "@/models/otpModel";
import { createToken } from "@/lib/tokenGenerate";
import { cookies } from "next/headers"; // ✅ Yahan chalega, kyunki ye Route Handler hai

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
        const logginedData={
            _id:getUser._id,

            role:getUser.role,
            name:getUser.name,
            avatar:getUser.avatar

        }
    const token = createToken({
      _id: getUser._id.toString(),
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    });

       
            const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

        await getOtpData.deleteOne()
        return response(true ,200,'Login successfully.',{...logginedData,token})

    } catch (error) {
        console.error("Verify Email Error:", error);

        return catchError(error);
    }
}