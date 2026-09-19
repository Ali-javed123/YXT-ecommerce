import { connectDB } from "@/lib/databaseConnection";
import { emailVerificationLink } from "@/lib/emailVerificationLink";
import {
  response,
  catchError,
  generateOTP,
} from "@/lib/helperFunctions";
import { createToken } from "@/lib/tokenGenerate";
import OtpModal from "@/lib/zodScheema/otpModals";
import { loginSchema } from "@/lib/zodScheema/zosScheema";
import UsersModel from "@/models/user.models";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/lib/otpEmail";

export async function POST(request: Request) {
  try {
    // Connect database
    await connectDB();

    // Get request body
    const payload = await request.json();

    // Validate request
    const validation = loginSchema.safeParse(payload);

    if (!validation.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validation.error
      );
    }

    const { email, password } = payload;

    // Find user
    const getUser = await UsersModel.findOne({
    deletedAt: null,
      email,
    }).select("+password");
console.log("getUser",getUser)
    // User not found
    if (!getUser) {
      return response(false, 404, "Invalid credentials!");
    }

    // Check password
    const isPasswordVerified = await getUser.comparePassword(password);

    if (!isPasswordVerified) {
      return response(false, 400, "Invalid credentials!");
    }

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    // If user has not verified email
    if (!getUser.isEmailVerify) {
      const token = createToken(getUser._id.toString());

      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`;

      const mailResult = await sendMail(
        email,
        "Email Verification Request from Developer Ali Javed",
        emailVerificationLink(verificationUrl)
      );

      if (!mailResult.success) {
        return response(
          false,
          500,
          "Failed to send verification email!"
        );
      }

      return response(
        false,
        403,
        "Please verify your email before logging in."
      );
    }

    // =====================================================
    // OTP
    // =====================================================

    // Delete old OTP
    await OtpModal.deleteMany({ email });

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP
    const otpCreate = await new OtpModal({
      email,
      otp,
    }).save();

    // Send OTP email
    const otpEmailStatus = await sendMail(
      email,
      "Your Login Verification Code",
      otpEmail(otp)
    );

    // OTP email failed
    if (!otpEmailStatus.success) {
      // Remove OTP if email failed
      await OtpModal.deleteOne({
        _id: otpCreate._id,
      });

      return response(
        false,
        500,
        "Failed to send OTP!"
      );
    }

    // OTP successfully sent
    return response(
      true,
      200,
      "OTP has been sent to your email."
    );
  } catch (error) {
    return catchError(error);
  }
}

