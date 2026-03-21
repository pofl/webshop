import { z } from "zod";

/** Shared param schema for routes with a single numeric :id */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/** Query schema for product search */
export const searchQuerySchema = z.object({
  q: z.string().default(""),
});

/** Form schema for adding a product to the cart */
export const addToCartFormSchema = z.object({
  product_id: z.coerce.number().int().positive(),
});
