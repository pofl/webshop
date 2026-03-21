import { Link } from "react-router";
import { useCartStore } from "../store";

export function Header() {
  const count = useCartStore((s) => s.count);
  return (
    <header className="site-header">
      <Link to="/" className="site-title">
        Web Shop
      </Link>
      <Link to="/cart" className="cart-button">
        🛒 Cart
        {count > 0 && <span className="cart-badge">{count}</span>}
      </Link>
    </header>
  );
}
