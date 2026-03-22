import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import type { Repository } from "@webshop/database";
import type { ProductRecord } from "@webshop/shared";
import { ProductList } from "./products.js";

const HomePage: FC<{ products: ProductRecord[]; cartCount: number }> = ({ products, cartCount }) => {
  return (
    <Layout title="Web Shop" cartCount={cartCount}>
      <h1>Web Shop</h1>
      <section class="card">
        <input
          type="text"
          name="q"
          placeholder="Search products…"
          class="search-input"
          hx-get="/products/search"
          hx-trigger="input changed delay:200ms"
          hx-target="#product-list"
          hx-swap="outerHTML"
          autofocus
        />
      </section>
      <ProductList products={products} />
    </Layout>
  );
};

export const createHomeRoutes = (repo: Repository) => {
  const app = new Hono();

  app.get("/", (c) => {
    const products = repo.searchProducts("");
    const cartCount = repo.countCartItems();
    return c.html(<HomePage products={products} cartCount={cartCount} />);
  });

  return app;
};
