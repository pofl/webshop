export interface ProductRecord {
  id: number;
  name: string;
  description: string;
  price_cents: number;
}

export interface CartItemRecord {
  id: number;
  product_id: number;
  product_name: string;
  price_cents: number;
  created_at: string;
}

export interface CartResponse {
  items: CartItemRecord[];
  count: number;
}
