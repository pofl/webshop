import type { APIRoute } from "astro";
import { addToCart } from "@webshop/database";
import { db } from "../../lib/db.js";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const productId = Number(formData.get("product_id"));

  if (Number.isInteger(productId) && productId > 0) {
    addToCart(db, productId);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/cart",
    },
  });
};
