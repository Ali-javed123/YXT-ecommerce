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
  let errorObj: { message: string; error?: unknown };
  // const errorData =
  //   process.env.NODE_ENV === "development"
  //     ? {
  //         error: error?.message,
  //         stack: error?.stack,
  //       }
  //     : {};
  if(process.env.NODE_ENV === "development"){
    errorObj={
      message: error?.message || message,
      error
    }
  }else{
    errorObj={
      message: customMessage || "Internal Server Error"
    }
    
  }

  return NextResponse.json({
    success: false,
    statusCode,
    message,
    errorData: errorObj
  });
};

export const generateOTP=()=>{
  const otp=Math.floor(100000+Math.random()*900000).toString()
  return otp;
}