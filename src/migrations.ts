import type { Migration } from "./db/migrate.js";

export const migrations: Migration[] = [
  {
    id: "20260220-create-products-and-cart",
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        price_cents INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );

      CREATE INDEX IF NOT EXISTS products_name_idx ON products (name);

      INSERT OR IGNORE INTO products (id, name, description, price_cents) VALUES
        (1, 'Wireless Headphones', 'Over-ear noise-cancelling headphones with 30h battery', 7999),
        (2, 'Mechanical Keyboard', 'Compact TKL keyboard with tactile switches', 12999),
        (3, 'USB-C Hub', '7-in-1 hub with HDMI, USB-A, SD card reader', 3499),
        (4, 'Webcam HD', '1080p webcam with built-in microphone', 5999),
        (5, 'Mouse Pad XL', 'Extra-large desk mat, 90x40cm', 1999),
        (6, 'LED Desk Lamp', 'Adjustable color temperature and brightness', 2999),
        (7, 'Laptop Stand', 'Aluminium adjustable laptop stand', 4499),
        (8, 'HDMI Cable 2m', '4K-ready braided HDMI cable', 999);

      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      );

      CREATE INDEX IF NOT EXISTS cart_items_product_idx ON cart_items (product_id);
    `,
  },
  {
    id: "20260302-add-session-id-to-cart-items",
    sql: `
      ALTER TABLE cart_items ADD COLUMN session_id TEXT;
      CREATE INDEX IF NOT EXISTS cart_items_session_idx ON cart_items (session_id);
    `,
  },
];
