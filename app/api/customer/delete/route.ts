import { NextRequest } from "next/server";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import UsersModel from "@/models/user.model";
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

    const user = await UsersModel.find({
      _id: { $in: ids },
    });

    if (user.length !== ids.length) {
      return response(false, 404, "Some customer items were not found");
    }

    const deletedAt = deleteType === "SD" ? new Date() : null;

    await UsersModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt } }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "user moved to trash"
        : "user restored"
    );
  } catch (error: unknown) {
    console.error("user update error:", error);

    return response(
      false,
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

export async function DELETE (request: NextRequest) {
  
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
    const customer = await UsersModel.find({
      _id: { $in: ids },
    }).lean();

    if (customer.length === 0) {
      return response(false, 404, "customer not found");
    }

    // Delete Product records from MongoDB
    const result = await UsersModel.deleteMany({
      _id: { $in: ids },
    });

    // Delete associated Cloudinary resources
   

    return response(
      true,
      200,
      ` customer item(s) deleted permanently.`
    );
  } catch (error: unknown) {
    console.error("Permanent customer deletion error:", error);

    return response(
      false,
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
