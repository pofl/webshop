import type { Child, FC } from "hono/jsx";

interface LayoutProps {
  title: string;
  children?: Child;
}

export const Layout: FC<LayoutProps> = ({ title, children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.8/dist/htmx.min.js"></script>
        <link rel="stylesheet" href="/static/styles.css"></link>
      </head>
      <body>
        <main class="container">{children}</main>
      </body>
    </html>
  );
};
