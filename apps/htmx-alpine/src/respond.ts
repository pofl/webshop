import type { Context } from "hono";
import type { JSX } from "hono/jsx/jsx-runtime";

/**
 * Returns a fragment for HTMX requests, a full page for direct browser loads.
 */
export const respond = (c: Context, fragment: JSX.Element, page: JSX.Element) =>
  c.html(c.req.header("HX-Request") ? fragment : page);
