import type { Database } from "better-sqlite3";
import type { ProductRecord, CartItemRecord } from "@webshop/shared";

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

export class Repository {
  constructor(private readonly db: Database) {}

  searchProducts(query: string): ProductRecord[] {
    const rows = this.db.prepare("SELECT * FROM products WHERE name LIKE ? ORDER BY name").all(`%${query}%`) as Record<
      string,
      unknown
    >[];
    return rows.map(parseProductRecord);
  }

  getProductById(id: number): ProductRecord | null {
    const row = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    if (!row) return null;
    return parseProductRecord(row as Record<string, unknown>);
  }

  addToCart(productId: number): void {
    this.db.prepare("INSERT INTO cart_items (product_id) VALUES (?)").run(productId);
  }

  listCartItems(): CartItemRecord[] {
    const rows = this.db
      .prepare(
        `SELECT ci.id, ci.product_id, ci.created_at, p.name AS product_name, p.price_cents
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         ORDER BY ci.created_at DESC`
      )
      .all() as Record<string, unknown>[];
    return rows.map(parseCartItemRecord);
  }

  removeCartItem(id: number): void {
    this.db.prepare("DELETE FROM cart_items WHERE id = ?").run(id);
  }

  addToCartSession(productId: number, sessionId: string): CartItemRecord {
    const result = this.db
      .prepare("INSERT INTO cart_items (product_id, session_id) VALUES (?, ?) RETURNING id, created_at")
      .get(productId, sessionId) as { id: number; created_at: string };
    const product = this.getProductById(productId)!;
    return {
      id: result.id,
      product_id: productId,
      product_name: product.name,
      price_cents: product.price_cents,
      created_at: result.created_at,
    };
  }

  listCartItemsSession(sessionId: string): CartItemRecord[] {
    const rows = this.db
      .prepare(
        `SELECT ci.id, ci.product_id, ci.created_at, p.name AS product_name, p.price_cents
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         WHERE ci.session_id = ?
         ORDER BY ci.created_at DESC`
      )
      .all(sessionId) as Record<string, unknown>[];
    return rows.map(parseCartItemRecord);
  }

  removeCartItemSession(id: number, sessionId: string): boolean {
    const result = this.db.prepare("DELETE FROM cart_items WHERE id = ? AND session_id = ?").run(id, sessionId);
    return result.changes > 0;
  }

  countCartItemsSession(sessionId: string): number {
    const row = this.db
      .prepare("SELECT COUNT(*) as count FROM cart_items WHERE session_id = ?")
      .get(sessionId) as Record<string, unknown>;
    return Number(row.count);
  }

  countCartItems(): number {
    const row = this.db.prepare("SELECT COUNT(*) as count FROM cart_items").get() as Record<string, unknown>;
    return Number(row.count);
  }
}
