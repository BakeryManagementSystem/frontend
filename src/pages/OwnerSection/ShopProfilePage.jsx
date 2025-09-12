import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ShopProfilePage.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const api = (p) => `${API_BASE}${p}`;

// Safely extract shop fields from different payload shapes
function normalizeShopPayload(raw) {
    const s = raw?.shop ?? raw ?? {};
    // determine best image url
    const logoUrl =
        s.logo_url ||
        s.photo_url ||
        (s.logo_path ? `${API_BASE}/storage/${s.logo_path}` : "");

    return {
        shop_name: s.shop_name || "Your Shop",
        address: s.address || "",
        phone: s.phone || "",
        facebook_url: s.facebook_url || "",
        image_url: logoUrl || "",
        stats: s.stats || null,
    };
}

export default function ShopProfilePage() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const ownerId = useMemo(
        () => user?.id || Number(localStorage.getItem("user_id")) || null,
        [user?.id]
    );

    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // auth gate
    useEffect(() => {
        const token =
            localStorage.getItem("token") || localStorage.getItem("access_token");
        const userType = (
            user?.user_type || localStorage.getItem("user_type") || "buyer"
        ).toLowerCase();

        if (!isAuthenticated && !token) {
            navigate("/auth");
            return;
        }
        if (userType !== "owner" && userType !== "seller") {
            navigate("/profile");
        }
    }, [isAuthenticated, navigate, user?.user_type]);

    // load shop profile
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setErr("");
                const token =
                    localStorage.getItem("token") ||
                    localStorage.getItem("access_token") ||
                    "";

                // Your protected endpoint
                const res = await fetch(api("/api/me/shop-profile"), {
                    headers: {
                        Accept: "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });

                if (!alive) return;

                if (!res.ok) {
                    setErr("Failed to load shop profile");
                    setShop(null);
                    return;
                }

                const data = await res.json().catch(() => ({}));
                setShop(normalizeShopPayload(data));
            } catch {
                if (alive) {
                    setErr("Failed to load shop profile");
                    setShop(null);
                }
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [ownerId]);

    const ownerName = useMemo(
        () => user?.name || localStorage.getItem("name") || "Shop Owner",
        [user?.name]
    );
    const ownerEmail = useMemo(
        () => user?.email || localStorage.getItem("email") || "owner@example.com",
        [user?.email]
    );

    const initials = useMemo(() => {
        const base = shop?.shop_name || ownerName || "";
        const parts = String(base).trim().split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] ?? "";
        const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + last).toUpperCase() || "S";
    }, [shop?.shop_name, ownerName]);

    const onLogout = () => {
        logout?.();
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        navigate("/auth");
    };

    return (
        <main className="sp-main">
            <section className="sp-shell">
                <div className="sp-topbar">
                    <div className="sp-title">
                        <h1>Shop Profile</h1>
                        <span className="sp-role sp-role--owner">owner</span>
                    </div>
                    <div className="sp-actions">
                        <Link to="/owner/shop/edit" className="btn btn-primary">
                            Edit Shop
                        </Link>
                        <button className="btn btn-ghost" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="sp-cover">
                    <div className="sp-cover-overlay" />
                    <div className="sp-avatar">
                        {shop?.image_url ? (
                            <img src={shop.image_url} alt="Shop" className="sp-avatar-img" />
                        ) : (
                            <div className="sp-avatar-circle" aria-label="Shop avatar">
                                {initials}
                            </div>
                        )}
                    </div>
                </div>

                <div className="sp-card">
                    <div className="sp-card-header">
                        <h2>Shop Information</h2>
                        {!loading && !err && (
                            <Link className="sp-inline-link" to="/owner/shop/edit">
                                Update details
                            </Link>
                        )}
                    </div>

                    {loading && <div className="sp-loading">Loading shop…</div>}
                    {err && <div className="sp-error">{err}</div>}

                    {!loading && !err && (
                        <div className="sp-grid">
                            <div className="sp-field">
                                <label>Shop Name</label>
                                <div className="sp-value">{shop?.shop_name || "—"}</div>
                            </div>
                            <div className="sp-field">
                                <label>Address</label>
                                <div className="sp-value">{shop?.address || "—"}</div>
                            </div>
                            <div className="sp-field">
                                <label>Facebook</label>
                                <div className="sp-value">
                                    {shop?.facebook_url ? (
                                        <a
                                            href={shop.facebook_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="sp-link"
                                        >
                                            {shop.facebook_url}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </div>
                            </div>
                            <div className="sp-field">
                                <label>Phone</label>
                                <div className="sp-value">{shop?.phone || "—"}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="sp-card">
                    <div className="sp-card-header">
                        <h2>Owner</h2>
                    </div>
                    <div className="sp-owner">
                        <div className="sp-owner-avatar">👤</div>
                        <div className="sp-owner-info">
                            <div className="sp-owner-name">{ownerName}</div>
                            <div className="sp-owner-sub">{ownerEmail}</div>
                        </div>
                    </div>
                </div>

                <div className="sp-card">
                    <div className="sp-card-header">
                        <h2>Quick Links</h2>
                    </div>
                    <div className="sp-quick">
                        <Link to="/owner" className="sp-quick-item">
                            <span className="sp-quick-icon">📊</span>
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/owner/attachments" className="sp-quick-item">
                            <span className="sp-quick-icon">📎</span>
                            <span>Attachments</span>
                        </Link>
                        <Link to="/owner/purchases" className="sp-quick-item">
                            <span className="sp-quick-icon">💳</span>
                            <span>Sales & Purchases</span>
                        </Link>
                    </div>
                </div>

                <div className="sp-stats">
                    <div className="sp-stat">
                        <div className="sp-stat-num">{shop?.stats?.products ?? 24}</div>
                        <div className="sp-stat-label">Products</div>
                    </div>
                    <div className="sp-stat">
                        <div className="sp-stat-num">{shop?.stats?.orders ?? 58}</div>
                        <div className="sp-stat-label">Orders</div>
                    </div>
                    <div className="sp-stat">
                        <div className="sp-stat-num">
                            {shop?.stats?.revenue
                                ? `৳${Number(shop.stats.revenue).toLocaleString()}`
                                : "৳75,400"}
                        </div>
                        <div className="sp-stat-label">Revenue (mo)</div>
                    </div>
                </div>
            </section>
        </main>
    );
}
