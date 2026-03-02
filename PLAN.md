# Plan

This is a demo codebase. The app is a simple webshop. We will gradually add
several techstacks to this repo. I will present in a presentation how these
architectural approaches solve the same problems.

All apps in this repo share the following:

* Persistence in a SQLite database.
* No ORM. Simple repository-like abstraction based on raw SQL queries instead.
* Shared stylesheet.

Every milestone adds another version of the app implemented in another tech
stack. With each milestone existing apps are kept and new ones added. Though,
structural changes that make the codebase well-organized are allowed.

## 1st Milestone: Modern SSR - DONE

Build a simple demo web shop app. The web shop has a search bar. Upon typing in
it a request is sent to the backend. A list of products is displayed that match
the search term. Clicking on a product I go to the product page where I can add
it to the cart. I see a button in the top right corner to go to my cart and
there is also a count of items. In the cart I see a list of items and I can
remove them.

1st milestone is to build this as a SSR-app using Hono JSX for rendering and
HTMX and Alpine.js for interactivity.

## 2nd Milestone: React SPA - PENDING

Rebuild the same app, ideally reusing the same styles, in Vite + React +
react-router + zustand. Extend the existing HTTP API with a /api subroute in
routes/api.ts. Here we expose JSON endpoints with which the SPA can interact
with the same database as the SSR app. On success, endpoints return JSON
entities or no content. On error they return { error: "..." }. Keep separate
`npm run dev`-like commands for the Hono server and for Vite/React.
