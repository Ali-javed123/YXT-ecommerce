import z from "zod";

export const CategorySchema = z.object({
  name: z.string().trim().min(1, "name is required!"),
  slug: z.string().trim().min(1, "slug is required!")
})