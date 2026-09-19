// import { connectDB } from "@/lib/databaseConnection";
// import { response } from "@/lib/helperFunctions";
// import { registerSchema } from "@/lib/zodScheema/zosScheema";
// import UsersModel from "@/models/user.models";
// import { NextResponse } from "next/server";
// import { createToken } from "@/lib/tokenGenerate";
// import { sendMail } from "@/lib/sendMail";
// import { emailVerificationLink } from "@/lib/emailVerificationLink";
// import { catchError } from "next/error";
// export async function POST(request:any){
//     try {
//         await connectDB()
//         const validateSchema=registerSchema.pick({
//             password:true,email:true
//         })
//         const payload=await request.json()
//         const validatedData=validateSchema.safeParse(payload)
//         if(!validatedData.success){
//            return response(false,401,"Invalid or massing input field.",validatedData)
           
//         }
//         const {email,password}=validatedData.data
//         const checkUser=await UsersModel.exists({email})
//         if(checkUser){
//             return response(true,409,"user already registred.")
//         }
//         const newResiter=new UsersModel({
//             name,email,password
//         })
//         await newResiter.save()
//          const token = createToken(newResiter);

//          await sendMail("Email Verification request from Developer Ali Javed",email,emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`))
// return response(true,200,"Registration success,Please verify your email address",validatedData)

//     } catch (error:any) {
//         catchError(error)
//     }
// } 
import { NextResponse } from "next/server";


export const response = (
  success: boolean,
  statusCode: number,
  message: string,
  data: unknown = {}
) => {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    {
      status: statusCode,
    }
  );
};

export const catchError = (
  error: any,
  customMessage?: string
) => {
  let statusCode = 500;

  let message =
    customMessage || "Internal Server Error";

  // MongoDB duplicate key error
  if (error?.code === 11000) {
    const keys = Object.keys(
      error?.keyPattern || {}
    ).join(", ");

    message = `Duplicate field: ${keys}. These field values must be unique.`;

    statusCode = 409;
  } else {
    // Show actual error only in development
    if (process.env.NODE_ENV === "development") {
      message =
        error?.message || message;
    }
  }

  const errorData =
    process.env.NODE_ENV === "development"
      ? {
          error: error?.message,
          stack: error?.stack,
        }
      : {};

  return response(
    false,
    statusCode,
    message,
    errorData
  );
};