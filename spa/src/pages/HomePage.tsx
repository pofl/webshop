import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { searchProducts, type Product } from "../api";
import { useCartStore } from "../store";

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const load = useCartStore((s) => s.load);

  const doSearch = useCallback(async (q: string) => {
    setLoading(true);
    const result = await searchProducts(q);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setProducts(result.data.products);
  }, []);

  // Load cart count on mount
  useEffect(() => {
    void load();
  }, [load]);

  // Initial product load
  useEffect(() => {
    void doSearch("");
  }, [doSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void doSearch(q), 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    void doSearch(query);
  };

  return (
    <>
      <h1>Web Shop</h1>
      <section className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search products…"
            className="search-input"
            autoFocus
          />
        </form>
      </section>
      {error && <p className="muted">{error}</p>}
      {loading && <p className="muted">Loading…</p>}
      <section id="product-list" className="product-grid">
        {!loading && products.length === 0 && <p className="muted">No products found.</p>}
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="product-card">
            <div className="product-name">{product.name}</div>
            <div className="product-price">{formatPrice(product.price_cents)}</div>
          </Link>
        ))}
      </section>
    </>
  );
}
