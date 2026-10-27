import { NextRequest } from "next/server";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import MediaModel from "@/models/mediaModel";
import cloudinary from "@/lib/cloudinary";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const schema = z.object({
  _id: z.string().trim().min(1, "ID is required"),
  asset_id: z.string().min(1),
  public_id: z.string().min(1),
  url: z.url(),
  format: z.string().optional(),
  width: z.number().optional(),
height: z.number().optional(),
  bytes: z.number().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const auth = await isAuthenticated(request,"admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized");

    await connectDB();

    const payload = await request.json();
    const validate = schema.safeParse(payload);
    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields");
    }

    const { _id, asset_id, public_id, url, format, width, height, bytes } =
      validate.data;

    if (!isValidObjectId(_id)) {
      return response(false, 404, "Invalid object ID");
    }

    const media = await MediaModel.findById(_id);
    if (!media) return response(false, 404, "Media not found");

    const oldPublicId = media.public_id;

    // naye image ka data set karo (alt/title same rahenge)
    media.asset_id = asset_id;
    media.public_id = public_id;
    media.url = url;
    if (format) media.format = format;
    if (width) media.width = width;
    if (height) media.height = height;
    if (bytes) media.bytes = bytes;

    await media.save();

    // purani image Cloudinary se delete
    if (oldPublicId && oldPublicId !== public_id) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (err) {
        console.error("Old image cleanup failed:", err);
      }
    }

    return response(true, 200, "Image updated successfully", media);
  } catch (error: any) {
    return catchError(error);
  }
}