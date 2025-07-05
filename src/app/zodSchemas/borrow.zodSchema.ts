import { z } from "zod";

export const borrowZodSchema = z.object({
  book: z.string().refine(val => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  }),
  quantity: z.number().int().min(1),
  dueDate: z.coerce.date(),
})