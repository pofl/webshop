import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { Layout } from "../components/Layout.js";
import { respond } from "../respond.js";
import type { Repository } from "@webshop/database";
import type { ProductRecord } from "@webshop/shared";
import { ProductList } from "./products.js";

const HomeContent: FC<{ products: ProductRecord[] }> = ({ products }) => (
  <div>
    <h1>Web Shop</h1>
    <section class="card" x-data="{ query: '' }">
      <input
        type="text"
        name="q"
        placeholder="Search products…"
        class="search-input"
        x-model="query"
        hx-get="/products/search"
        hx-trigger="input changed delay:200ms"
        hx-target="#product-list"
        hx-swap="outerHTML"
        autofocus
      />
    </section>
    <ProductList products={products} />
  </div>
);

const HomePage: FC<{ products: ProductRecord[]; cartCount: number }> = ({ products, cartCount }) => (
  <Layout title="Web Shop" cartCount={cartCount}>
    <HomeContent products={products} />
  </Layout>
);

export const createHomeRoutes = (repo: Repository) => {
  const app = new Hono();

  app.get("/", (c) => {
    const products = repo.searchProducts("");
    const cartCount = repo.countCartItems();
    return respond(c, <HomeContent products={products} />, <HomePage products={products} cartCount={cartCount} />);
  });

  return app;
};
