import { NextRequest } from "next/server";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import MediaModel from "@/models/mediaModel";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";

export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await isAuthenticated(request,"admin");

    if (!isAdmin.isAuth) {
      return response(false, 401, "Not authorized");
    }

    await connectDB();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid IDs or empty data");
    }

    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid delete type");
    }

    const media = await MediaModel.find({
      _id: { $in: ids },
    });

    if (media.length !== ids.length) {
      return response(false, 404, "Some media items were not found");
    }

    const deletedAt = deleteType === "SD" ? new Date() : null;

    await MediaModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt } }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "Media moved to trash"
        : "Media restored"
    );
  } catch (error: unknown) {
    console.error("Media update error:", error);

    return response(
      false,
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await isAuthenticated(request,"admin");

    if (!isAdmin.isAuth) {
      return response(false, 401, "Not authorized");
    }

    await connectDB();

    const { ids, deleteType } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid IDs or empty data");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "Invalid delete type");
    }

    // Validate MongoDB IDs
    if (!ids.every((id: string) => mongoose.Types.ObjectId.isValid(id))) {
      return response(false, 400, "Invalid MongoDB ID");
    }

    // Find multiple media records
    const media = await MediaModel.find({
      _id: { $in: ids },
    }).lean();

    if (media.length === 0) {
      return response(false, 404, "Media not found");
    }

    // Delete media records from MongoDB
    const result = await MediaModel.deleteMany({
      _id: { $in: ids },
    });

    // Delete associated Cloudinary resources
    const publicIds = media
      .map((item: any) => item.public_id)
      .filter(Boolean);

    let cloudinaryWarning = "";

    if (publicIds.length > 0) {
      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (error) {
        console.error("Cloudinary deletion error:", error);
        cloudinaryWarning =
          " Database records deleted, but Cloudinary cleanup failed.";
      }
    }

    return response(
      true,
      200,
      `${result.deletedCount} media item(s) deleted permanently.${cloudinaryWarning}`
    );
  } catch (error: unknown) {
    console.error("Permanent media deletion error:", error);

    return response(
      false,
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
