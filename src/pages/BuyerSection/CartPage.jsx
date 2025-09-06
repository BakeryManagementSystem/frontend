import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function CartPage() {
    const [cart, setCart] = useState({ items: [], total: "0.00", count: 0 });
    const [loading, setLoading] = useState(false);
    const [acting, setActing] = useState(false); // for button spinners
    const [msg, setMsg] = useState("");

    const token = localStorage.getItem("token");

    async function loadCart() {
        setLoading(true);
        setMsg("");
        try {
            const res = await fetch(`${API_BASE}/api/cart`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to fetch cart");
            setCart(data);
        } catch (e) {
            setMsg(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCart();
    }, []);

    async function setQty(productId, qty) {
        setActing(true);
        setMsg("");
        try {
            const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: qty }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Update failed");
            await loadCart();
        } catch (e) {
            setMsg(e.message);
        } finally {
            setActing(false);
        }
    }

    async function removeLine(productId) {
        setActing(true);
        setMsg("");
        try {
            const res = await fetch(`${API_BASE}/api/cart/${productId}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Remove failed");
            await loadCart();
        } catch (e) {
            setMsg(e.message);
        } finally {
            setActing(false);
        }
    }

    async function clearCart() {
        if (!confirm("Clear all items from your cart?")) return;
        setActing(true);
        setMsg("");
        try {
            const res = await fetch(`${API_BASE}/api/cart`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Clear failed");
            await loadCart();
        } catch (e) {
            setMsg(e.message);
        } finally {
            setActing(false);
        }
    }

    async function checkout() {
        setActing(true);
        setMsg("");
        try {
            const res = await fetch(`${API_BASE}/api/orders/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Checkout failed");
            setMsg("Order placed successfully!");
            await loadCart(); // cart is cleared by backend
        } catch (e) {
            setMsg(e.message);
        } finally {
            setActing(false);
        }
    }

    const styles = {
        page: {
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
            background: "linear-gradient(135deg, #fafafa, #f4f6ff)",
            width: "100%",
        },
        card: {
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            padding: 16,
            display: "flex",
            gap: 12,
            alignItems: "center",
        },
        img: {
            width: 88,
            height: 88,
            objectFit: "cover",
            borderRadius: 12,
            background: "#f2f2f2",
        },
        title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" },
        sub: { margin: "2px 0 0", color: "#6b7280" },
        price: { fontWeight: 700, color: "#111827" },
        qtyWrap: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "4px 8px",
            background: "#fff",
        },
        qtyBtn: {
            border: "none",
            background: "#f3f4f6",
            borderRadius: 8,
            width: 28,
            height: 28,
            fontSize: 18,
            cursor: "pointer",
        },
        removeBtn: {
            border: "none",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: 12,
            padding: "8px 10px",
            cursor: "pointer",
        },
        headerRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
        },
        actionPrimary: {
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            minWidth: 160,
        },
        actionGhost: {
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#111827",
            fontWeight: 600,
            cursor: "pointer",
            minWidth: 140,
        },
        footer: {
            position: "sticky",
            bottom: 0,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            borderTop: "1px solid #e5e7eb",
            padding: "12px 16px",
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 16,
        },
    };

    return (
        <main style={styles.page}>
            <div style={styles.headerRow}>
                <div>
                    <h2 style={{ margin: 0, color: "#111827" }}>Your Cart</h2>
                    <p style={{ marginTop: 4, color: "#6b7280" }}>
                        {loading ? "Loading..." : cart.count ? `${cart.count} item(s)` : "Your cart is empty"}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.actionGhost} onClick={clearCart} disabled={acting || !cart.items.length}>
                        {acting ? "Working..." : "Clear Cart"}
                    </button>
                    <button style={styles.actionPrimary} onClick={checkout} disabled={acting || !cart.items.length}>
                        {acting ? "Placing..." : "Place Order"}
                    </button>
                </div>
            </div>

            {msg && (
                <div
                    style={{
                        marginBottom: 12,
                        padding: "10px 12px",
                        borderRadius: 12,
                        background: "#ecfdf5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                    }}
                >
                    {msg}
                </div>
            )}

            <div style={{ display: "grid", gap: 12 }}>
                {cart.items.map((it) => (
                    <div key={it.product_id} style={styles.card}>
                        <img src={it.image_url || ""} alt={it.name} style={styles.img} />
                        <div style={{ flex: 1 }}>
                            <h4 style={styles.title}>{it.name}</h4>
                            <p style={styles.sub}>{it.category || "—"}</p>
                            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={styles.price}>${it.price}</span>
                                <div style={styles.qtyWrap}>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => setQty(it.product_id, Math.max(0, Number(it.quantity) - 1))}
                                        disabled={acting}
                                        title="Decrease"
                                    >
                                        −
                                    </button>
                                    <span style={{ minWidth: 20, textAlign: "center" }}>{it.quantity}</span>
                                    <button
                                        style={styles.qtyBtn}
                                        onClick={() => setQty(it.product_id, Number(it.quantity) + 1)}
                                        disabled={acting}
                                        title="Increase"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 14, color: "#6b7280" }}>Line total</div>
                            <div style={{ fontSize: 18, fontWeight: 800 }}>${it.line_total}</div>
                            <button
                                style={{ ...styles.removeBtn, marginTop: 8 }}
                                onClick={() => removeLine(it.product_id)}
                                disabled={acting}
                                title="Remove item"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.footer}>
                <div style={{ fontSize: 16, color: "#6b7280" }}>Subtotal</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>${cart.total}</div>
            </div>
        </main>
    );
}
