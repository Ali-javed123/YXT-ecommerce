import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { catchError } from "@/lib/helperFunctions";
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { paramsToSign } = payload;
    if (!paramsToSign) {
      return NextResponse.json(
        { error: "paramsToSign missing" },
        { status: 400 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECREAT_KEY as string
    );

    return NextResponse.json({ success: true, signature });
  } catch (error:any) {
    console.log("Cloudinary signature error:", error);
    return catchError(error);
  }
}