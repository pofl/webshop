import { Link, Route, Routes } from "react-router-dom";
import { useCartStore } from "./store";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

export default function App() {
  const count = useCartStore((s) => s.count);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-title">
          Web Shop
        </Link>
        <Link to="/cart" className="cart-button">
          🛒 Cart
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </>
  );
}
