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
        <link rel="stylesheet" href="/static/styles.css"></link>
      </head>
      <body>
        <header class="site-header">
          <a href="/" class="site-title">
            Web Shop
          </a>
          <a href="/cart" class="cart-button">
            🛒 Cart
            {cartCount > 0 && <span class="cart-badge">{cartCount}</span>}
          </a>
        </header>
        <main class="container">{children}</main>
      </body>
    </html>
  );
};
