import { z } from "zod";

export const todoSchema = z.object({
    text: z
  .string()
  .trim(),
  email:z.email(),
  isCompleted:z.boolean()
})