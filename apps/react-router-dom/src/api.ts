export type { ProductRecord as Product, CartItemRecord as CartItem, CartResponse } from "@webshop/shared";
import type { CartItemRecord, CartResponse, ProductRecord } from "@webshop/shared";

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; ok: true } | { error: string; ok: false }> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (res.status === 204) return { data: undefined as T, ok: true };
  const json = await res.json();
  if (!res.ok) return { error: (json as { error: string }).error ?? "An error occurred", ok: false };
  return { data: json as T, ok: true };
}

export async function searchProducts(q: string) {
  return request<{ products: ProductRecord[] }>(`/api/products/search?q=${encodeURIComponent(q)}`);
}

export async function getProduct(id: number) {
  return request<ProductRecord>(`/api/products/${id}`);
}

export async function fetchCart() {
  return request<CartResponse>("/api/cart");
}

export async function addToCart(product_id: number) {
  return request<CartItemRecord>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id }),
  });
}

export async function removeFromCart(id: number) {
  return request<void>(`/api/cart/items/${id}`, { method: "DELETE" });
}
