import { NextRequest } from "next/server";
import { connectDB } from "@/lib/databaseConnection";
import { todoSchema } from "@/lib/todoSchema";
import { response } from "@/lib/helperFunctions";
import todoModules from "@/models/todoModel";
import { catchError } from "@/lib/helperFunctions";
export async function POST(request:NextRequest) {
  try {
    await  connectDB()
    const payload = await request.json();

    const validation = todoSchema.safeParse(payload);

if (!validation.success) {
  return response(
    false,
    401,
    "Invalid or missing input field.",
    validation.error
  );

}
const { text, email,isCompleted } = payload;

const newTodos = new todoModules({
    text,
    email,
    isCompleted
})
await newTodos.save()
return response(true, 200, "new todo created successfully", newTodos)    
  } catch (error) {
    catchError(error)
  }
}

export async function GET(request:NextRequest){
    try {
        await connectDB()
        const todo=await todoModules.find()
        return response(true,200,"all todo",todo)
    } catch (error) {
        catchError(error)
    }
}