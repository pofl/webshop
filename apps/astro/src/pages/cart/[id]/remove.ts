import type { APIRoute } from "astro";
import { removeCartItem } from "@webshop/database";
import { db } from "../../../lib/db.js";

export const POST: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (Number.isInteger(id) && id > 0) {
    removeCartItem(db, id);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/cart",
    },
  });
};
