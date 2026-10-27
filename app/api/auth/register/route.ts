  import { connectDB } from "@/lib/databaseConnection";
  import { response, catchError } from "@/lib/helperFunctions";
  import { registerSchema } from "@/lib/zodScheema/zosScheema";
  import UsersModel from "@/models/user.model";
  import { createToken } from "@/lib/tokenGenerate";
  import { sendMail } from "@/lib/sendMail";
  import { emailVerificationLink } from "@/lib/emailVerificationLink";

  export async function POST(request: Request) {
    try {
      await connectDB();

      const payload = await request.json();

      const validatedData = registerSchema.safeParse(payload);

      if (!validatedData.success) {
        return response(
          false,
          400,
          "Invalid or missing input field.",
          validatedData.error
        );
      }

      const { username, email, password } = validatedData.data;

      const checkUser = await UsersModel.exists({ email });

      if (checkUser) {
        return response(
          false,
          409,
          "User already registered."
        );
      }

      const newRegister = new UsersModel({
        name:username,
        email,
        password,
      });

      await newRegister.save();

const token = createToken({
      _id: newRegister._id.toString(),
      role: newRegister.role,
      name: newRegister.name,
      avatar: newRegister.avatar,
    });
      const mailResult = await sendMail(
        email,
        "Email Verification request from Developer Ali Javed",
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );
      if (!mailResult.success) {
  return response(
    false,
    500,
    "Registration successful, but verification email could not be sent."
  );
}

      console.log("token",token)

      return response(
        true,
        
        201,
        "Registration successful. Please verify your email address."
      );

    } catch (error: any) {
      return catchError(error);
    }
  }