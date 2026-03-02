import type { Database } from "better-sqlite3";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import { countCartItems, getProductById, searchProducts, type ProductRecord } from "../repository.js";
import { idParamSchema, searchQuerySchema } from "../schemas.js";
import { zValidator } from "../validator-wrapper.js";

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export const ProductList: FC<{ products: ProductRecord[] }> = ({ products }) => (
  <section id="product-list" class="product-grid">
    {products.length === 0 ? (
      <p class="muted">No products found.</p>
    ) : (
      products.map((product) => (
        <a href={`/products/${product.id}`} class="product-card">
          <div class="product-name">{product.name}</div>
          <div class="product-price">{formatPrice(product.price_cents)}</div>
        </a>
      ))
    )}
  </section>
);

const ProductDetailPage: FC<{ product: ProductRecord; cartCount: number }> = ({ product, cartCount }) => (
  <Layout title={product.name} cartCount={cartCount}>
    <a href="/" class="back-link">
      ← Back to search
    </a>
    <section class="card">
      <h1>{product.name}</h1>
      <p class="muted">{product.description}</p>
      <p class="product-price-large">{formatPrice(product.price_cents)}</p>
      <form method="post" action="/cart/add">
        <input type="hidden" name="product_id" value={product.id} />
        <button type="submit">Add to Cart</button>
      </form>
    </section>
  </Layout>
);

export const createProductRoutes = (db: Database) => {
  const app = new Hono();

  app.get("/search", zValidator("query", searchQuerySchema), (c) => {
    const { q } = c.req.valid("query");
    const products = searchProducts(db, q);
    return c.html(<ProductList products={products} />);
  });

  app.get("/:id", zValidator("param", idParamSchema), (c) => {
    const { id } = c.req.valid("param");
    const product = getProductById(db, id);
    if (!product) return c.notFound();
    const cartCount = countCartItems(db);
    return c.html(<ProductDetailPage product={product} cartCount={cartCount} />);
  });

  return app;
};
