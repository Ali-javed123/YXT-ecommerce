import { NextRequest } from "next/server";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import MediaModel from "@/models/mediaModel";
import cloudinary from "@/lib/cloudinary";


export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    const auth = await isAuthenticated(request,"admin");
    console.log("auth",auth)
    if (!auth?.isAuth) {
      return response(false, 403, "Unauthorized."); // ✅ return zaroori
    }

    await connectDB();

    const newMedia = await MediaModel.insertMany(payload);

    return response(true, 200, "Media uploaded successfully.", newMedia);
  } catch (error) {
    // Agar DB insert fail ho jaye, to Cloudinary se bhi delete kar do (orphan file na rahe)
    if (payload && payload.length > 0) {
      const public_ids = payload.map((data: any) => data.public_id);
      try {
        await cloudinary.api.delete_resources(public_ids);
      } catch (deleteError: any) {
        console.error("Cloudinary cleanup failed:", deleteError);
      }
    }

    return catchError(error); // ✅ return zaroori
  }
}