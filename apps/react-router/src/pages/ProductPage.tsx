import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { formatPrice } from "@webshop/shared";
import { getProduct } from "../api";
import type { Product } from "../api";
import { useCartStore } from "../store";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const add = useCartStore((s) => s.add);
  const load = useCartStore((s) => s.load);

  useEffect(() => {
    if (!id) return;
    void getProduct(Number(id)).then((result) => {
      if (!result.ok) {
        setNotFound(true);
        return;
      }
      setProduct(result.data);
    });
    void load();
  }, [id, load]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const error = await add(product.id);
    setAdding(false);
    if (error) {
      setAddError(error);
    } else {
      setAddError(null);
    }
  };

  if (notFound) {
    return (
      <>
        <Link to="/" className="back-link">
          ← Back to search
        </Link>
        <p className="muted">Product not found.</p>
      </>
    );
  }

  if (!product) {
    return <p className="muted">Loading…</p>;
  }

  return (
    <>
      <Link to="/" className="back-link">
        ← Back to search
      </Link>
      <section className="card">
        <h1>{product.name}</h1>
        <p className="muted">{product.description}</p>
        <p className="product-price-large">{formatPrice(product.price_cents)}</p>
        <button onClick={() => void handleAddToCart()} disabled={adding}>
          {adding ? "Adding…" : "Add to Cart"}
        </button>
        {addError && <p className="muted">{addError}</p>}
      </section>
    </>
  );
}
