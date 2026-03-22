import type { APIRoute } from "astro";
import { repo } from "../../../lib/db.js";

export const POST: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (Number.isInteger(id) && id > 0) {
    repo.removeCartItem(id);
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/cart",
    },
  });
};
