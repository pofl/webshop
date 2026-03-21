export interface Product {
  id: number;
  name: string;
  description: string;
  price_cents: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price_cents: number;
  created_at: string;
}

export interface CartResponse {
  items: CartItem[];
  count: number;
}

async function request<T>(
  url: string,
  options?: RequestInit,
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
  return request<{ products: Product[] }>(`/api/products/search?q=${encodeURIComponent(q)}`);
}

export async function getProduct(id: number) {
  return request<Product>(`/api/products/${id}`);
}

export async function fetchCart() {
  return request<CartResponse>("/api/cart");
}

export async function addToCart(product_id: number) {
  return request<CartItem>("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id }),
  });
}

export async function removeFromCart(id: number) {
  return request<void>(`/api/cart/items/${id}`, { method: "DELETE" });
}
