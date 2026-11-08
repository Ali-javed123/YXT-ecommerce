import { NextRequest } from "next/server";
import { catchError, isAuthenticated, response } from "@/lib/helperFunctions";
import { connectDB } from "@/lib/databaseConnection";
import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose";
import ProductModels from "@/models/Product.model";
import ProductVaientModel from "@/models/productVarient.model";

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

    const product = await ProductVaientModel.find({
      _id: { $in: ids },
    });

    if (product.length !== ids.length) {
      return response(false, 404, "Some product varient items were not found");
    }

    const deletedAt = deleteType === "SD" ? new Date() : null;

    await ProductVaientModel.updateMany(
      { _id: { $in: ids } },
      { $set: { deletedAt } }
    );

    return response(
      true,
      200,
      deleteType === "SD"
        ? "product varient moved to trash"
        : "product varient restored"
    );
  } catch (error: unknown) {
    console.error("product varient update error:", error);

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
    const product = await ProductVaientModel.find({
      _id: { $in: ids },
    }).lean();

    if (product.length === 0) {
      return response(false, 404, "product not found");
    }

    // Delete product records from MongoDB
    const result = await ProductVaientModel.deleteMany({
      _id: { $in: ids },
    });

    // Delete associated Cloudinary resources
   

    return response(
      true,
      200,
      ` product item(s) deleted permanently.`
    );
  } catch (error: unknown) {
    console.error("Permanent product deletion error:", error);

    return response(
      false,
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
