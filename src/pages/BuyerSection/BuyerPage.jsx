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

    // Buy Now Modal State
    const [showBuyNowModal, setShowBuyNowModal] = useState(false);
    const [buyNowProduct, setBuyNowProduct] = useState(null);
    const [buyNowData, setBuyNowData] = useState({
        buyer_name: '',
        buyer_email: '',
        buyer_phone: '',
        buyer_address: '',
        quantity: 1
    });
    const [buyNowLoading, setBuyNowLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    const token = localStorage.getItem("token");


    // Fetch user profile when component mounts
    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/user-profile`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const profile = await res.json();
                setUserProfile(profile);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    // Open Buy Now Modal
    const openBuyNowModal = (product) => {
        setBuyNowProduct(product);
        setBuyNowData({
            buyer_name: userProfile?.name || '',
            buyer_email: userProfile?.email || '',
            quantity: 1
        });
        setShowBuyNowModal(true);
        document.body.style.overflow = "hidden";
    };

    // Close Buy Now Modal
    const closeBuyNowModal = () => {
        setShowBuyNowModal(false);
        setBuyNowProduct(null);
        setBuyNowData({
            buyer_phone: '',
            buyer_address: '',
            quantity: 1
        });
        document.body.style.overflow = "";
    };

    // Handle Buy Now form submission
    const handleBuyNow = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("Please log in to place an order.");
            return;
        }

        setBuyNowLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/buy-now`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: buyNowProduct.id,
                    ...buyNowData
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Order placed successfully!');
                closeBuyNowModal();
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Buy now error:', error);
            alert(error.message);
        } finally {
            setBuyNowLoading(false);
        }
    };

    // Calculate total price
    const totalPrice = buyNowProduct ? (buyNowProduct.price * buyNowData.quantity).toFixed(2) : '0.00';



    // Fetch products whenever q changes (server-side search)
     useEffect(() => {
           let alive = true;
           setLoading(true);
           setErr("");
           const url = new URL(`${API_BASE}/api/products`);
           url.searchParams.set("per_page", "24");
           if (q) url.searchParams.set("q", q);         // 👈 send q to backend
               fetch(url.toString(), { headers: { Accept: "application/json" } })
             .then((r) => r.json())
             .then((data) => {
                   if (!alive) return;
                   const rows = Array.isArray(data?.data) ? data.data : data;
                   setItems(rows || []);
                 })
             .catch(() => alive && setErr("Failed to load products"))
             .finally(() => alive && setLoading(false));
           return () => { alive = false; };
         }, [q]);  // 👈 refetch when query changes

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
                                    onClick={(e) => { e.stopPropagation(); openBuyNowModal(p); }}
                                >
                                    Order Now
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {/* Buy Now Modal */}
            {/* Buy Now Modal */}
            {showBuyNowModal && buyNowProduct && (
                <div className="modal-backdrop" onClick={closeBuyNowModal}>
                    <div
                        className="modal-card modal-animate-in buy-now-modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button className="modal-close" onClick={closeBuyNowModal} aria-label="Close">✕</button>

                        <div className="modal-content buy-now-layout">
                            {/* Left side - product preview */}
                            <div className="buy-now-left">
                                <div className="product-image-box">
                                    {buyNowProduct.image_url ? (
                                        <img src={buyNowProduct.image_url} alt={buyNowProduct.name} />
                                    ) : (
                                        <div className="product-placeholder">No Image</div>
                                    )}
                                </div>
                                <div className="product-info-box">
                                    <h2 className="product-title">{buyNowProduct.name}</h2>
                                    <p className="product-price">${buyNowProduct.price}</p>
                                    {buyNowProduct.category && (
                                        <span className="product-category">{buyNowProduct.category}</span>
                                    )}
                                </div>
                            </div>

                            {/* Right side - form */}
                            <div className="buy-now-right">
                                <h3 className="form-heading">Complete Your Order</h3>

                                <form onSubmit={handleBuyNow} className="buy-now-form">
                                    <div className="form-group">
                                        <label htmlFor="buyer_name">Name *</label>
                                        <input
                                            type="text"
                                            id="buyer_name"
                                            value={buyNowData.buyer_name}
                                            onChange={(e) => setBuyNowData({ ...buyNowData, buyer_name: e.target.value })}
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="buyer_email">Email *</label>
                                        <input
                                            type="email"
                                            id="buyer_email"
                                            value={buyNowData.buyer_email}
                                            onChange={(e) => setBuyNowData({ ...buyNowData, buyer_email: e.target.value })}
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="buyer_phone">Phone *</label>
                                        <input
                                            type="tel"
                                            id="buyer_phone"
                                            value={buyNowData.buyer_phone}
                                            onChange={(e) => setBuyNowData({ ...buyNowData, buyer_phone: e.target.value })}
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="buyer_address">Address *</label>
                                        <textarea
                                            id="buyer_address"
                                            value={buyNowData.buyer_address}
                                            onChange={(e) => setBuyNowData({ ...buyNowData, buyer_address: e.target.value })}
                                            required
                                            className="form-textarea"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="quantity">Quantity *</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            min="1"
                                            value={buyNowData.quantity}
                                            onChange={(e) =>
                                                setBuyNowData({ ...buyNowData, quantity: parseInt(e.target.value) || 1 })
                                            }
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="total-section">
                                        <div className="total-row">
                                            <span>Total Amount:</span>
                                            <span className="total-price">${totalPrice}</span>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            onClick={closeBuyNowModal}
                                            className="btn btn-secondary"
                                            disabled={buyNowLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={buyNowLoading}
                                        >
                                            {buyNowLoading ? "Placing Order..." : "Place Order"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
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

                                    <button className="btn btn-dark"
                                            onClick={() => openBuyNowModal(selected)}

                                    >Order Now</button>
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
