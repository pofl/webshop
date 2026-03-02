import type { Database } from "better-sqlite3";

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

function parseProductRecord(row: Record<string, unknown>): ProductRecord {
  return {
    id: Number(row.id),
    name: String(row.name),
    description: String(row.description),
    price_cents: Number(row.price_cents),
  };
}

function parseCartItemRecord(row: Record<string, unknown>): CartItemRecord {
  return {
    id: Number(row.id),
    product_id: Number(row.product_id),
    product_name: String(row.product_name),
    price_cents: Number(row.price_cents),
    created_at: String(row.created_at),
  };
}

export function searchProducts(db: Database, query: string): ProductRecord[] {
  const rows = db
    .prepare("SELECT * FROM products WHERE name LIKE ? ORDER BY name")
    .all(`%${query}%`) as Record<string, unknown>[];
  return rows.map(parseProductRecord);
}

export function getProductById(db: Database, id: number): ProductRecord | null {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!row) return null;
  return parseProductRecord(row as Record<string, unknown>);
}

export function addToCart(db: Database, productId: number): void {
  db.prepare("INSERT INTO cart_items (product_id) VALUES (?)").run(productId);
}

export function listCartItems(db: Database): CartItemRecord[] {
  const rows = db
    .prepare(
      `SELECT ci.id, ci.product_id, ci.created_at, p.name AS product_name, p.price_cents
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       ORDER BY ci.created_at DESC`
    )
    .all() as Record<string, unknown>[];
  return rows.map(parseCartItemRecord);
}

export function removeCartItem(db: Database, id: number): void {
  db.prepare("DELETE FROM cart_items WHERE id = ?").run(id);
}

export function countCartItems(db: Database): number {
  const row = db.prepare("SELECT COUNT(*) as count FROM cart_items").get() as Record<string, unknown>;
  return Number(row.count);
}
