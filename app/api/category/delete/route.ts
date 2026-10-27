import { NextRequest } from "next/server";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import CategoriesModel from "@/models/categoryModel";
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

    const category = await CategoriesModel.find({
      _id: { $in: ids },
    });

    if (category.length !== ids.length) {
      return response(false, 404, "Some category items were not found");
    }

    const deletedAt = deleteType === "SD" ? new Date() : null;

    await CategoriesModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt } }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "category moved to trash"
        : "category restored"
    );
  } catch (error: unknown) {
    console.error("category update error:", error);

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
    const Category = await CategoriesModel.find({
      _id: { $in: ids },
    }).lean();

    if (Category.length === 0) {
      return response(false, 404, "Category not found");
    }

    // Delete Category records from MongoDB
    const result = await CategoriesModel.deleteMany({
      _id: { $in: ids },
    });

    // Delete associated Cloudinary resources
   

    return response(
      true,
      200,
      ` Category item(s) deleted permanently.`
    );
  } catch (error: unknown) {
    console.error("Permanent Category deletion error:", error);

    return response(
      false,
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
