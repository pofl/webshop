import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import type { Repository } from "@webshop/database";
import type { CartItemRecord } from "@webshop/shared";
import { addToCartFormSchema, formatPrice, idParamSchema } from "@webshop/shared";
import { zValidator } from "../validator-wrapper.js";

export const CartBadge: FC<{ cartCount: number }> = ({ cartCount }) => (
  <a href="/cart" class="cart-button" id="cart-badge-container">
    🛒 Cart
    {cartCount > 0 && <span class="cart-badge">{cartCount}</span>}
  </a>
);

export const CartContent: FC<{ items: CartItemRecord[] }> = ({ items }) => (
  <div>
    <h1>Your Cart</h1>
    {items.length === 0 ? (
      <section class="card">
        <p class="muted">Your cart is empty.</p>
        <a href="/" hx-get="/partials/" hx-target="#main-content" hx-swap="innerHTML" hx-push-url="/">
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
                hx-get={`/partials/products/${item.product_id}`}
                hx-target="#main-content"
                hx-swap="innerHTML"
                hx-push-url={`/products/${item.product_id}`}
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
    return c.html(<CartPage items={items} cartCount={cartCount} />);
  });

  app.post("/add", zValidator("form", addToCartFormSchema), (c) => {
    const { product_id } = c.req.valid("form");
    repo.addToCart(product_id);
    const cartCount = repo.countCartItems();
    return c.html(<CartBadge cartCount={cartCount} />);
  });

  app.post("/:id/remove", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    repo.removeCartItem(id);
    const items = repo.listCartItems();
    return c.html(<CartContent items={items} />);
  });

  return app;
};

export const createCartPartialRoutes = (repo: Repository) => {
  const app = new Hono();

  app.get("/", (c) => {
    const items = repo.listCartItems();
    return c.html(<CartContent items={items} />);
  });

  return app;
};
