import type { Database } from "better-sqlite3";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import { addToCart, countCartItems, listCartItems, removeCartItem } from "@webshop/database";
import type { CartItemRecord } from "@webshop/shared";
import { addToCartFormSchema, formatPrice, idParamSchema } from "@webshop/shared";
import { zValidator } from "../validator-wrapper.js";

const CartPage: FC<{ items: CartItemRecord[]; cartCount: number }> = ({ items, cartCount }) => (
  <Layout title="Your Cart" cartCount={cartCount}>
    <h1>Your Cart</h1>
    {items.length === 0 ? (
      <section class="card">
        <p class="muted">Your cart is empty.</p>
        <a href="/">Continue shopping</a>
      </section>
    ) : (
      <section class="card">
        <ul class="cart-list">
          {items.map((item) => (
            <li class="cart-item">
              <a href={`/products/${item.product_id}`} class="cart-item-name">
                {item.product_name}
              </a>
              <span class="cart-item-price">{formatPrice(item.price_cents)}</span>
              <form method="post" action={`/cart/${item.id}/remove`}>
                <button type="submit" class="button-danger">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    )}
  </Layout>
);

export const createCartRoutes = (db: Database) => {
  const app = new Hono();

  app.get("/", (c) => {
    const items = listCartItems(db);
    const cartCount = countCartItems(db);
    return c.html(<CartPage items={items} cartCount={cartCount} />);
  });

  app.post("/add", zValidator("form", addToCartFormSchema), (c) => {
    const { product_id } = c.req.valid("form");
    addToCart(db, product_id);
    return c.redirect("/cart");
  });

  app.post("/:id/remove", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    removeCartItem(db, id);
    return c.redirect("/cart");
  });

  return app;
};
