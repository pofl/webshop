import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import { respond } from "../respond.js";
import type { Repository } from "@webshop/database";
import type { ProductRecord } from "@webshop/shared";
import { formatPrice } from "@webshop/shared";
import { idParamSchema, searchQuerySchema } from "@webshop/shared";
import { zValidator } from "../validator-wrapper.js";

export const ProductList: FC<{ products: ProductRecord[] }> = ({ products }) => (
  <section id="product-list" class="product-grid">
    {products.length === 0 ? (
      <p class="muted">No products found.</p>
    ) : (
      products.map((product) => (
        <a
          href={`/products/${product.id}`}
          class="product-card"
          hx-get={`/products/${product.id}`}
          hx-target="#main-content"
          hx-swap="innerHTML"
          hx-push-url="true"
        >
          <div class="product-name">{product.name}</div>
          <div class="product-price">{formatPrice(product.price_cents)}</div>
        </a>
      ))
    )}
  </section>
);

const ProductDetailContent: FC<{ product: ProductRecord }> = ({ product }) => (
  <div>
    <a href="/" class="back-link" hx-get="/" hx-target="#main-content" hx-swap="innerHTML" hx-push-url="true">
      ← Back to search
    </a>
    <section class="card" x-data="{ adding: false, added: false }">
      <h1>{product.name}</h1>
      <p class="muted">{product.description}</p>
      <p class="product-price-large">{formatPrice(product.price_cents)}</p>
      <form
        hx-post="/cart/add"
        hx-target="#cart-badge-container"
        hx-swap="outerHTML"
        {...{ "x-on:htmx:before-request": "adding = true; added = false" }}
        {...{ "x-on:htmx:after-request": "adding = false; added = true" }}
      >
        <input type="hidden" name="product_id" value={product.id} />
        <button type="submit" {...{ "x-bind:disabled": "adding" }}>
          <span x-show="!adding && !added">Add to Cart</span>
          <span x-show="adding" x-cloak>
            Adding…
          </span>
          <span x-show="added" x-cloak>
            Added!
          </span>
        </button>
      </form>
    </section>
  </div>
);

const ProductDetailPage: FC<{ product: ProductRecord; cartCount: number }> = ({ product, cartCount }) => (
  <Layout title={product.name} cartCount={cartCount}>
    <ProductDetailContent product={product} />
  </Layout>
);

export const createProductRoutes = (repo: Repository) => {
  const app = new Hono();

  app.get("/search", zValidator("query", searchQuerySchema), (c) => {
    const { q } = c.req.valid("query");
    const products = repo.searchProducts(q);
    return c.html(<ProductList products={products} />);
  });

  app.get("/:id", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    const product = repo.getProductById(id);
    if (!product) return c.notFound();
    const cartCount = repo.countCartItems();
    return respond(
      c,
      <ProductDetailContent product={product} />,
      <ProductDetailPage product={product} cartCount={cartCount} />
    );
  });

  return app;
};
