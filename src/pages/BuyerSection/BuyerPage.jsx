import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./BuyerPage.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BuyerPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const q = params.get("q")?.trim().toLowerCase() || "";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [selected, setSelected] = useState(null); // product selected for modal
    const [seller, setSeller] = useState(null);     // { shop, owner }
    const [sellerLoading, setSellerLoading] = useState(false);
    const [sellerErr, setSellerErr] = useState("");
    const token = localStorage.getItem("token");
    // Fetch products
    useEffect(() => {
        let alive = true;
        setLoading(true);
        setErr("");
        fetch(`${API_BASE}/api/products?per_page=24`, {
            headers: { Accept: "application/json" },
        })
            .then((r) => r.json())
            .then((data) => {
                if (!alive) return;
                const rows = Array.isArray(data?.data) ? data.data : data;
                setItems(rows || []);
            })
            .catch(() => alive && setErr("Failed to load products"))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, []);

    // Simple client-side filter by name/category
    const filtered = useMemo(() => {
        if (!q) return items;
        return items.filter((p) => {
            const hay = `${p?.name || ""} ${p?.category || ""}`.toLowerCase();
            return hay.includes(q);
        });
    }, [items, q]);

    // Fetch shop & owner by owner_id when a product is selected
    const fetchSeller = useCallback(async (ownerId) => {
        if (!ownerId) {
            setSeller(null);
            return;
        }
        setSeller(null);
        setSellerErr("");
        setSellerLoading(true);
        try {
            // Adjust this endpoint to your actual public shop-profile route.
            // Examples you might have:
            //  - GET /api/shops/{ownerId}
            //  - GET /api/owner/{ownerId}/shop-profile
            //  - Or include shop data in /api/products response (ideal)
            const shopRes = await fetch(`${API_BASE}/api/shops/${ownerId}`, {
                headers: { Accept: "application/json" },
            });
            let shop = null;
            if (shopRes.ok) {
                shop = await shopRes.json().catch(() => null);
            }

            // Optional (if you expose a public user endpoint):
            // const usrRes = await fetch(`${API_BASE}/api/users/${ownerId}`, { headers: { Accept: "application/json" }});
            // const owner = usrRes.ok ? await usrRes.json().catch(() => null) : null;

            // If you don’t have /api/users/:id, we can try to use what’s inside product
            // as a fallback later.
            const data = { shop, owner: null };
            setSeller(data);
        } catch (e) {
            setSellerErr("Could not load shop/owner info.");
        } finally {
            setSellerLoading(false);
        }
    }, []);

    // Open modal
    const openPreview = (product) => {
        setSelected(product);
        if (product?.owner_id) {
            fetchSeller(product.owner_id);
        } else {
            setSeller(null);
        }
        // prevent body scroll while modal open
        document.body.style.overflow = "hidden";
    };

    // Close modal
    const closePreview = () => {
        setSelected(null);
        setSeller(null);
        setSellerErr("");
        setSellerLoading(false);
        document.body.style.overflow = "";
    };

    // ESC to close
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") closePreview();
        };
        if (selected) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selected]);


    async function addToCart(productId, qty = 1) {
        if (!token) {
            alert("Please log in to add items to your cart.");
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: productId, quantity: qty }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.message || `Add to cart failed (${res.status})`);
            }
            // Optional toast/snackbar here
            console.log("Added to cart:", data);
        } catch (e) {
            console.error(e);
            alert(e.message);
        }
    }

    return (
        <div className="buyer-main">
            <section className="welcome">
                <h1 className="welcome-title">Welcome to Smart Bakery</h1>
                <p className="welcome-sub">
                    {q ? <>Results for: <strong>{q}</strong></> : "Fresh baked goods delivered to your door"}
                </p>
            </section>

            {loading && <div className="buyer-loading">Loading products…</div>}
            {err && <div className="buyer-error">{err}</div>}

            {!loading && !err && (
                <section className="grid">
                    {filtered.length === 0 && (
                        <div className="buyer-empty">No items found.</div>
                    )}
                    {filtered.map((p) => (
                        <article
                            key={p.id || p.name}
                            className="item-card item-card--hover"
                            onClick={() => openPreview(p)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === "Enter" ? openPreview(p) : null)}
                        >
                            <div className="item-top">
                                <div className="item-circle">
                                    {p?.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="item-img" />
                                    ) : (
                                        <svg className="item-circle-icon" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="item-title">{p.name}</h3>
                                <p className="item-price">
                                    {typeof p.price === "number" ? p.price.toFixed(2) : p.price}
                                </p>
                                {p.category && <span className="item-tag">{p.category}</span>}
                            </div>
                            <div className="item-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={(e) => { e.stopPropagation(); addToCart(p.id, 1); }}
                                >
                                    Add to Cart
                                </button>

                                <button
                                    className="btn btn-dark"
                                    onClick={(e) => { e.stopPropagation(); /* wire order-now */ }}
                                >
                                    Order Now
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {/* Modal Preview */}
            {selected && (
                <div className="modal-backdrop" onClick={closePreview}>
                    <div
                        className="modal-card modal-animate-in"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button className="modal-close" onClick={closePreview} aria-label="Close preview">✕</button>

                        <div className="modal-content">
                            <div className="modal-media">
                                {selected.image_url ? (
                                    <img src={selected.image_url} alt={selected.name} />
                                ) : (
                                    <div className="modal-placeholder">No Image</div>
                                )}
                            </div>

                            <div className="modal-info">
                                <h2 className="modal-title">{selected.name}</h2>
                                <div className="modal-price-row">
                  <span className="modal-price">
                    {typeof selected.price === "number" ? selected.price.toFixed(2) : selected.price}
                  </span>
                                    {selected.category && <span className="modal-chip">{selected.category}</span>}
                                </div>
                                {selected.description && (
                                    <p className="modal-desc">{selected.description}</p>
                                )}

                                <div className="modal-actions">
                                    <button className="btn btn-primary" onClick={() => addToCart(selected.id, 1)}>
                                        Add to Cart
                                    </button>

                                    <button className="btn btn-dark">Order Now</button>
                                </div>

                                <div className="modal-divider" />

                                <div className="modal-seller">
                                    <h3>Shop & Owner</h3>

                                    {sellerLoading && <div className="buyer-loading">Loading shop info…</div>}
                                    {sellerErr && <div className="buyer-error">{sellerErr}</div>}

                                    {!sellerLoading && !sellerErr && (
                                        <>
                                            {/* Shop block */}
                                            <div className="seller-block">
                                                <div className="seller-avatar">🏬</div>
                                                <div className="seller-details">
                                                    <div className="seller-name">
                                                        {seller?.shop?.shop_name || "Shop information"}
                                                    </div>
                                                    {seller?.shop?.address && (
                                                        <div className="seller-sub">{seller.shop.address}</div>
                                                    )}
                                                    {seller?.shop?.facebook_url && (
                                                        <a
                                                            href={seller.shop.facebook_url}
                                                            className="seller-link"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Facebook
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Owner block (fallback: not all APIs expose it) */}
                                            <div className="seller-block">
                                                <div className="seller-avatar">👤</div>
                                                <div className="seller-details">
                                                    <div className="seller-name">
                                                        {seller?.owner?.name ||
                                                            selected?.owner_name || // if you later include owner name in products payload
                                                            "Owner"}
                                                    </div>
                                                    {(seller?.owner?.email || selected?.owner_email) && (
                                                        <div className="seller-sub">
                                                            {seller?.owner?.email || selected?.owner_email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
