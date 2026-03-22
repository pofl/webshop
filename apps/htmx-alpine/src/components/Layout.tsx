import type { Child, FC } from "hono/jsx";

interface LayoutProps {
  title: string;
  children?: Child;
  cartCount?: number;
}

export const Layout: FC<LayoutProps> = ({ title, children, cartCount = 0 }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <link rel="stylesheet" href="/static/styles.css"></link>
      </head>
      <body hx-boost="true">
        <header class="site-header">
          <a href="/" class="site-title">
            Web Shop
          </a>
          <a href="/cart" class="cart-button" id="cart-badge-container">
            🛒 Cart
            {cartCount > 0 && <span class="cart-badge">{cartCount}</span>}
          </a>
        </header>
        <main id="main-content" class="container">
          {children}
        </main>
      </body>
    </html>
  );
};
