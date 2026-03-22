import type { APIRoute } from "astro";
import { formatPrice } from "@webshop/shared";
import { repo } from "../../lib/db.js";

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export const GET: APIRoute = ({ url }) => {
  const query = url.searchParams.get("q") ?? "";
  const products = repo.searchProducts(query);

  const body =
    products.length === 0
      ? '<section id="product-list" class="product-grid"><p class="muted">No products found.</p></section>'
      : `<section id="product-list" class="product-grid">${products
          .map(
            (product) =>
              `<a href="/products/${product.id}" class="product-card"><div class="product-name">${escapeHtml(product.name)}</div><div class="product-price">${formatPrice(product.price_cents)}</div></a>`
          )
          .join("")}</section>`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};
