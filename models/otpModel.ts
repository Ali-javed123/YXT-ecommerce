import mongoose from "mongoose";

const otpScheema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
      expiresAt:{
        type:Date,
        required:true,
        default:()=>new Date(Date.now()+10*60*1000)
    }
},{timestamps:true}
)
otpScheema.index({expiresAt:1},{expireAfterSeconds:0})

const OtpModal = mongoose.models.OTP || mongoose.model('OTP', otpScheema, "otp")
export default OtpModal;