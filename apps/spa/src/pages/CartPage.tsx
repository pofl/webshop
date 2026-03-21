import { useEffect, useState } from "react";
import { Link } from "react-router";
import { formatPrice } from "@webshop/shared";
import { useCartStore } from "../store";

export default function CartPage() {
  const { items, load, remove } = useCartStore();
  const [removeErrors, setRemoveErrors] = useState<Record<number, string>>({});
  const [removing, setRemoving] = useState<Record<number, boolean>>({});

  useEffect(() => {
    void load();
  }, [load]);

  const handleRemove = async (id: number) => {
    setRemoving((prev) => ({ ...prev, [id]: true }));
    const error = await remove(id);
    setRemoving((prev) => ({ ...prev, [id]: false }));
    if (error) {
      setRemoveErrors((prev) => ({ ...prev, [id]: error }));
    } else {
      setRemoveErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <>
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <section className="card">
          <p className="muted">Your cart is empty.</p>
          <Link to="/">Continue shopping</Link>
        </section>
      ) : (
        <section className="card">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <Link to={`/products/${item.product_id}`} className="cart-item-name">
                  {item.product_name}
                </Link>
                <span className="cart-item-price">{formatPrice(item.price_cents)}</span>
                <div>
                  <button
                    className="button-danger"
                    onClick={() => void handleRemove(item.id)}
                    disabled={removing[item.id]}
                  >
                    {removing[item.id] ? "Removing…" : "Remove"}
                  </button>
                  {removeErrors[item.id] && <p className="muted">{removeErrors[item.id]}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
