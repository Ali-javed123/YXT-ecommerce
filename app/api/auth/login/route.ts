import { connectDB } from "@/lib/databaseConnection";
import { emailVerificationLink } from "@/lib/emailVerificationLink";
import {
  response,
  catchError,
  generateOTP,
} from "@/lib/helperFunctions";
import { createToken } from "@/lib/tokenGenerate";
import OtpModal from "@/models/otpModel";
import { loginSchema } from "@/lib/zodScheema/zosScheema";
import UsersModel from "@/models/user.model";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/lib/otpEmail";

export async function POST(request: Request) {
  try {
        console.time("total");
    console.time("connectDB");

    // Connect database
    await connectDB();
        console.timeEnd("connectDB");


        console.time("request.json");
    const payload = await request.json();
    console.timeEnd("request.json");


    console.time("validation");
    const validation = loginSchema.safeParse(payload);
    console.timeEnd("validation");

    if (!validation.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validation.error
      );
    }

    const { email, password } = payload;
    console.time("findUser");

    // Find user
    const getUser = await UsersModel.findOne({
    deletedAt: null,
      email,
    }).select("+password");
console.log("getUser",getUser)
console.timeEnd("findUser");
    // User not found
    if (!getUser) {
      return response(false, 404, "Invalid credentials!");
    }
    console.time("passwordCompare");

    // Check password
    const isPasswordVerified = await getUser.comparePassword(password);
    console.timeEnd("passwordCompare");

    if (!isPasswordVerified) {
      return response(false, 400, "Invalid credentials!");
    }

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    // If user has not verified email
        console.time("sendMail");

    if (!getUser.isEmailVerify) {
      const token = createToken(getUser._id.toString());

      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`;

      const mailResult = await sendMail(
        email,
        "Email Verification Request from Developer Ali Javed",
        emailVerificationLink(verificationUrl)
      );
    console.timeEnd("sendMail");

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
    console.timeEnd("total");

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
  }
// try{
//   console.time("total");

// console.time("connectDB");
// await connectDB();
// console.timeEnd("connectDB");

// console.time("request.json");
// const payload = await request.json();
// console.timeEnd("request.json");

// console.time("validation");
// const validation = loginSchema.safeParse(payload);
// console.timeEnd("validation");

// if (!validation.success) {
//   return response(
//     false,
//     401,
//     "Invalid or missing input field.",
//     validation.error
//   );
// }

// const { email, password } = payload;

// console.time("findUser");

// const getUser = await UsersModel
//   .findOne({
//     deletedAt: null,
//     email,
//   })
//   .select("+password");

// console.timeEnd("findUser");

// if (!getUser) {
//   return response(false, 404, "Invalid credentials!");
// }

// console.time("passwordCompare");

// const isPasswordVerified =
//   await getUser.comparePassword(password);

// console.timeEnd("passwordCompare");

// if (!isPasswordVerified) {
//   return response(false, 400, "Invalid credentials!");
// }


// // Email verification
// if (!getUser.isEmailVerify) {

//   console.time("verificationEmail");

//   const token = createToken(getUser._id.toString());

//   const verificationUrl =
//     `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`;

//   const mailResult = await sendMail(
//     email,
//     "Email Verification Request from Developer Ali Javed",
//     emailVerificationLink(verificationUrl)
//   );

//   console.timeEnd("verificationEmail");

//   if (!mailResult.success) {
//     return response(
//       false,
//       500,
//       "Failed to send verification email!"
//     );
//   }

//   console.timeEnd("total");

//   return response(
//     false,
//     403,
//     "Please verify your email before logging in."
//   );
// }


// // OTP

// console.time("deleteOTP");

// await OtpModal.deleteMany({ email });

// console.timeEnd("deleteOTP");


// const otp = generateOTP();


// console.time("saveOTP");

// const otpCreate = await new OtpModal({
//   email,
//   otp,
// }).save();

// console.timeEnd("saveOTP");


// console.time("otpEmail");

// const otpEmailStatus = await sendMail(
//   email,
//   "Your Login Verification Code",
//   otpEmail(otp)
// );

// console.timeEnd("otpEmail");


// if (!otpEmailStatus.success) {

//   await OtpModal.deleteOne({
//     _id: otpCreate._id,
//   });

//   console.timeEnd("total");

//   return response(
//     false,
//     500,
//     "Failed to send OTP!"
//   );
// }


// console.timeEnd("total");

// return response(
//   true,
//   200,
//   "OTP has been sent to your email."
// );
// }
   catch (error) {
    return catchError(error);
  }
}

