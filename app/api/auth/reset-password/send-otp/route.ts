import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunctions";
import { otpEmail } from "@/lib/otpEmail";
import { sendMail } from "@/lib/sendMail";
import OtpModal from "@/models/otpModel";
import { loginSchema } from "@/lib/zodScheema/zosScheema";
import UsersModel from "@/models/user.model";
export async function POST(request:any){
try {
    await connectDB()
    const payload=await request.json()
    const Validateschema=loginSchema.pick({
        email:true
    })
    const validated=Validateschema.safeParse(payload)
    if (!validated.success) {
            return response(
              false,
              400,
              "Invalid or missing input field.",
              validated.error
            );
          }
          const {email}=validated.data
          const userExist=await UsersModel.findOne({deletedAt:null,email}).lean()
          if(!userExist){
            return response(
              false,
              404,
              "user not found!.",
            );
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
                  return response(true,200,'please verify your account.')
          

} catch (error) {
        return catchError(error);

}
}