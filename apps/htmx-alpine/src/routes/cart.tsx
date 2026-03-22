import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import { respond } from "../respond.js";
import type { Repository } from "@webshop/database";
import type { CartItemRecord } from "@webshop/shared";
import { addToCartFormSchema, formatPrice, idParamSchema } from "@webshop/shared";
import { zValidator } from "../validator-wrapper.js";

const CartBadge: FC<{ cartCount: number }> = ({ cartCount }) => (
  <a href="/cart" class="cart-button" id="cart-badge-container">
    🛒 Cart
    {cartCount > 0 && <span class="cart-badge">{cartCount}</span>}
  </a>
);

const CartContent: FC<{ items: CartItemRecord[] }> = ({ items }) => (
  <div>
    <h1>Your Cart</h1>
    {items.length === 0 ? (
      <section class="card">
        <p class="muted">Your cart is empty.</p>
        <a href="/" hx-get="/" hx-target="#main-content" hx-swap="innerHTML" hx-push-url="true">
          Continue shopping
        </a>
      </section>
    ) : (
      <section class="card">
        <ul id="cart-items" class="cart-list">
          {items.map((item) => (
            <li class="cart-item" id={`cart-item-${item.id}`}>
              <a
                href={`/products/${item.product_id}`}
                class="cart-item-name"
                hx-get={`/products/${item.product_id}`}
                hx-target="#main-content"
                hx-swap="innerHTML"
                hx-push-url="true"
              >
                {item.product_name}
              </a>
              <span class="cart-item-price">{formatPrice(item.price_cents)}</span>
              <button
                type="button"
                class="button-danger"
                hx-post={`/cart/${item.id}/remove`}
                hx-target="#main-content"
                hx-swap="innerHTML"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

const CartPage: FC<{ items: CartItemRecord[]; cartCount: number }> = ({ items, cartCount }) => (
  <Layout title="Your Cart" cartCount={cartCount}>
    <CartContent items={items} />
  </Layout>
);

export const createCartRoutes = (repo: Repository) => {
  const app = new Hono();

  app.get("/", (c) => {
    const items = repo.listCartItems();
    const cartCount = repo.countCartItems();
    return respond(c, <CartContent items={items} />, <CartPage items={items} cartCount={cartCount} />);
  });

  app.post("/add", zValidator("form", addToCartFormSchema), (c) => {
    const { product_id } = c.req.valid("form");
    repo.addToCart(product_id);
    const cartCount = repo.countCartItems();
    // Return updated cart badge for in-place swap
    return c.html(<CartBadge cartCount={cartCount} />);
  });

  app.post("/:id/remove", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    repo.removeCartItem(id);
    // Return updated cart content after removal
    const items = repo.listCartItems();
    return c.html(<CartContent items={items} />);
  });

  return app;
};
