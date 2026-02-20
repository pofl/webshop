import { z } from "zod";

/** Shared param schema for routes with a single numeric :id */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/** Shared form schema for creating tasks */
export const taskTitleFormSchema = z.object({
  title: z.string().trim().min(1).max(200),
});
