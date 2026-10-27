import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunctions";
import { loginSchema } from "@/lib/zodScheema/zosScheema";
import UsersModel from "@/models/user.model";
import { catchError } from "@/lib/helperFunctions";
export async function PUT(request:any){
try {
    await connectDB()
    const payload=await request.json()
    const LoginScheema=loginSchema.pick({
        email:true,
        password:true,
    })
    const validated=LoginScheema.safeParse(payload)
if (!validated.success) {
            return response(
              false,
              400,
              "Invalid or missing input field.",
              validated.error
            );
          }
          const {email,password}=validated.data
          const userExist=await UsersModel.findOne({deletedAt:null,email}).select("+password")
                    if(!userExist){
                      return response(
                        false,
                        404,
                        "user not found!.",
                      );
                    }
          userExist.password=password
          await userExist.save()
          return response(true,200,'Password update successfully')
    
} catch (error:any) {
    return catchError(error)
}
}