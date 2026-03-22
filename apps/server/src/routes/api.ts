import { Hono } from "hono";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { Repository } from "@webshop/database";
import { addToCartFormSchema, idParamSchema, searchQuerySchema } from "@webshop/shared";
import { zValidator } from "../validator-wrapper.js";

function getOrCreateSession(c: Context): string {
  let sessionId = getCookie(c, "session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(c, "session_id", sessionId, {
      httpOnly: true,
      path: "/",
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return sessionId;
}

export const createApiRoutes = (repo: Repository) => {
  const app = new Hono();

  // Products
  app.get("/products/search", zValidator("query", searchQuerySchema), (c) => {
    const { q } = c.req.valid("query");
    const products = repo.searchProducts(q);
    return c.json({ products });
  });

  app.get("/products/:id", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    const product = repo.getProductById(id);
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json(product);
  });

  // Cart
  app.get("/cart", (c) => {
    const sessionId = getOrCreateSession(c);
    const items = repo.listCartItemsSession(sessionId);
    const count = repo.countCartItemsSession(sessionId);
    return c.json({ items, count });
  });

  app.post("/cart/items", zValidator("json", addToCartFormSchema), (c) => {
    const { product_id } = c.req.valid("json");
    const product = repo.getProductById(product_id);
    if (!product) return c.json({ error: "Product not found" }, 404);
    const sessionId = getOrCreateSession(c);
    const item = repo.addToCartSession(product_id, sessionId);
    return c.json(item, 201);
  });

  app.delete("/cart/items/:id", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    const sessionId = getOrCreateSession(c);
    const removed = repo.removeCartItemSession(id, sessionId);
    if (!removed) return c.json({ error: "Cart item not found" }, 404);
    return c.body(null, 204);
  });

  return app;
};
