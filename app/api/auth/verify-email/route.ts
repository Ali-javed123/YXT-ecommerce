import UsersModel from "@/models/user.model";
import { response, catchError } from "@/lib/helperFunctions";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/databaseConnection";
import { isValidObjectId } from "mongoose";

interface JwtPayload {
    userId: string;
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const { token } = await request.json();

        if (!token) {
            return response(false, 400, "Missing token.");
        }

        if (typeof token !== "string") {
            return response(false, 400, "Token must be a string.");
        }

    const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET!
) as jwt.JwtPayload & { _id: string };

        console.log("Token:", token);
        console.log("Decoded:", decoded);
        console.log("Decoded userId:", decoded.userId);

        if (!decoded.userId) {
            return response(
                false,
                400,
                "User ID is missing from token."
            );
        }

        // if (typeof decoded.userId !== "string") {
        //     return response(
        //         false,
        //         400,
        //         "Invalid user ID."
        //     );
        // }

        // if (!isValidObjectId(decoded.userId)) {
        //     return response(
        //         false,
        //         400,
        //         "Invalid user ID."
        //     );
        // }
        if (!decoded._id || !isValidObjectId(decoded._id)) {
  return response(false, 400, "Invalid user ID in token.");
}


        const user = await UsersModel.findById(decoded.userId);

        if (!user) {
            return response(
                false,
                404,
                "User not found."
            );
        }

        if (user.isEmailVerify) {
            return response(
                true,
                
                200,
                "Email is already verified."
            );
        }

        user.isEmailVerify = true;

        await user.save();

        return response(
            true,
            200,
            "Email Verification Success"
        );

    } catch (error) {
        console.error("Verify Email Error:", error);

        return catchError(error);
    }
}