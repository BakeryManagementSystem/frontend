// src/pages/ShopInformation.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ShopInformation.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ShopInformation() {
    const { productId } = useParams();

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [product, setProduct] = useState(null);
    const [shop, setShop] = useState(null);
    const [owner, setOwner] = useState(null);

    // make sure the page is scrollable even if previous modal locked body
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "";
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        let alive = true;
        async function load() {
            setLoading(true);
            setErr("");
            try {
                const res = await fetch(`${API_BASE}/api/shop-info/product/${productId}`, {
                    headers: { Accept: "application/json" },
                });
                const data = await res.json();
                if (!alive) return;

                if (!res.ok) throw new Error(data?.message || `Failed (${res.status})`);

                setProduct(data.product || null);
                setShop(data.shop || null);
                setOwner(data.owner || null);
            } catch (e) {
                setErr(e.message || "Failed to load shop info");
                setProduct(null);
                setShop(null);
                setOwner(null);
            } finally {
                if (alive) setLoading(false);
            }
        }
        if (productId) load();
        return () => { alive = false; };
    }, [productId]);

    const logoUrl = useMemo(() => shop?.logo_url || null, [shop]);

    return (
        <div className="shopinfo-page">
            <div className="shopinfo-container">
                <header className="shopinfo-header">
                    <div className="shopinfo-header-left">
                        <Link to="/buyer" className="shopinfo-back">← Back</Link>
                        <h1 className="shopinfo-title">
                            {shop?.shop_name || (loading ? "Loading…" : "Shop")}
                        </h1>
                        {shop?.facebook_url && (
                            <a
                                href={shop.facebook_url}
                                target="_blank"
                                rel="noreferrer"
                                className="shopinfo-social"
                                title="Facebook"
                            >
                                Facebook
                            </a>
                        )}
                    </div>
                    <div className="shopinfo-header-right">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Shop logo" className="shopinfo-logo" />
                        ) : (
                            <div className="shopinfo-logo placeholder">🏬</div>
                        )}
                    </div>
                </header>

                <section className="shopinfo-body">
                    {err && <div className="shopinfo-error">{err}</div>}

                    <div className="shopinfo-card">
                        <h2>Shop Information</h2>
                        <div className="shopinfo-grid">
                            <div className="shopinfo-row">
                                <span className="shopinfo-label">Shop Name</span>
                                <span className="shopinfo-value">{shop?.shop_name || "—"}</span>
                            </div>
                            <div className="shopinfo-row">
                                <span className="shopinfo-label">Address</span>
                                <span className="shopinfo-value">{shop?.address || "—"}</span>
                            </div>
                            <div className="shopinfo-row">
                                <span className="shopinfo-label">Phone</span>
                                <span className="shopinfo-value">{shop?.phone || "—"}</span>
                            </div>
                            <div className="shopinfo-row">
                                <span className="shopinfo-label">Facebook</span>
                                <span className="shopinfo-value">
                  {shop?.facebook_url ? (
                      <a href={shop.facebook_url} target="_blank" rel="noreferrer">
                          {shop.facebook_url}
                      </a>
                  ) : "—"}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="shopinfo-card">
                        <h2>Owner</h2>
                        <div className="shopinfo-grid">
                            <div className="shopinfo-row">
                                <span className="shopinfo-label">Name</span>
                                <span className="shopinfo-value">{owner?.name || "—"}</span>
                            </div>
                            <div className="shopinfo-row">
                                <span className="shopinfo-label">Email</span>
                                <span className="shopinfo-value">{owner?.email || "—"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="shopinfo-card">
                        <h2>Featured Product</h2>
                        {product ? (
                            <div className="shopinfo-product">
                                <div className="shopinfo-product-media">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} />
                                    ) : (
                                        <div className="shopinfo-product-ph">No image</div>
                                    )}
                                </div>
                                <div className="shopinfo-product-info">
                                    <div className="shopinfo-product-title">{product.name}</div>
                                    {product.category && (
                                        <div className="shopinfo-chip">{product.category}</div>
                                    )}
                                    {product.description && (
                                        <p className="shopinfo-product-desc">{product.description}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="shopinfo-muted">
                                {loading ? "Loading product…" : "Product not found."}
                            </div>
                        )}
                    </div>

                    {/* Keep or remove mock extras as you like */}
                    <div className="shopinfo-card">
                        <h2>About the Shop</h2>
                        <p className="shopinfo-muted">
                            Family-run bakery specializing in artisan breads and custom cakes.
                            Freshly baked every morning with locally sourced ingredients.
                        </p>
                        <div className="shopinfo-stats">
                            <div className="shopinfo-stat">
                                <div className="shopinfo-stat-number">4.8</div>
                                <div className="shopinfo-stat-label">Rating</div>
                            </div>
                            <div className="shopinfo-stat">
                                <div className="shopinfo-stat-number">120+</div>
                                <div className="shopinfo-stat-label">Products</div>
                            </div>
                            <div className="shopinfo-stat">
                                <div className="shopinfo-stat-number">7 yrs</div>
                                <div className="shopinfo-stat-label">In Business</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
