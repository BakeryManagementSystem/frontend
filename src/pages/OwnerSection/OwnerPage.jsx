// src/pages/OwnerPage.jsx
import { useEffect, useMemo, useState } from "react";
import ChatWidget from "../../components/Chatbot/ChatWidget.jsx";
// Use env API base if provided; otherwise fall back to relative "/api" (Vite proxy)
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const apiUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);

// Currency helper
const money = (n) =>
    Number(n ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function OwnerPage() {
    // ✅ read token once
    const token = useMemo(() => localStorage.getItem("token"), []);

    // Form state
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    // UI state
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({ show: false, text: "" });

    // Products (owner only)
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [q, setQ] = useState("");

    // Debounce search
    const [qDebounced, setQDebounced] = useState(q);
    useEffect(() => {
        const t = setTimeout(() => setQDebounced(q), 350);
        return () => clearTimeout(t);
    }, [q]);

    // 🔄 load ONLY this owner's products
    useEffect(() => {
        let canceled = false;
        async function load() {
            try {
                const qs = new URLSearchParams();
                qs.set("per_page", String(perPage));
                qs.set("page", String(page));
                // ✅ backend reads `search` (not `q`)
                if (qDebounced.trim()) qs.set("search", qDebounced.trim());
                // optional: if you add category filter server-side
                if (category.trim()) qs.set("category", category.trim());

                const res = await fetch(apiUrl(`/api/me/products?${qs.toString()}`), {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`, // ✅ protected route
                    },
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || `Failed (${res.status})`);
                if (canceled) return;

                // support either {data,meta} or bare array
                setProducts(
                    Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data)
                            ? data
                            : []
                );
                setMeta(data?.meta ? data.meta : { current_page: page, last_page: 1 });
            } catch (e) {
                if (!canceled) {
                    console.error("Load /api/me/products failed:", e);
                    setProducts([]);
                    setMeta({ current_page: 1, last_page: 1 });
                }
            }
        }
        if (token) {
            load();
        }
        return () => {
            canceled = true;
        };
    }, [page, perPage, qDebounced, category, token]);

    // image preview
    useEffect(() => {
        if (!file) {
            setPreviewUrl("");
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    function resetForm() {
        setName("");
        setCategory("");
        setPrice("");
        setDescription("");
        setFile(null);
        setPreviewUrl("");
        setErrors({});
    }

    function showToast(text) {
        setToast({ show: true, text });
        clearTimeout(showToast._t);
        showToast._t = setTimeout(
            () => setToast({ show: false, text: "" }),
            2300
        );
    }

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setErrors({});
        if (!token) {
            setMsg("You must be logged in as owner.");
            return;
        }
        if (!name.trim() || !price) {
            setErrors((p) => ({
                ...p,
                name: !name.trim() ? "Name is required" : undefined,
                price: !price ? "Price is required" : undefined,
            }));
            return;
        }

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("name", name.trim());
            if (description.trim()) fd.append("description", description.trim());
            fd.append("price", String(price));
            if (category.trim()) fd.append("category", category.trim());
            if (file) fd.append("image", file);
            // ✅ DO NOT send owner_id; backend should set owner from auth()

            const res = await fetch(apiUrl("/api/products"), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }, // ✅ protected create
                body: fd,
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 422 && data.errors) {
                    setErrors(flattenLaravelErrors(data.errors));
                    setMsg(data.message || "Validation error");
                } else {
                    setMsg(data.message || `Failed (${res.status})`);
                }
                return;
            }

            setMsg("Product created successfully!");
            showToast("Product created 🎉");
            resetForm();

            // ✅ quick refetch of owner-only list (fixed res vs res2 typo)
            setPage(1);
            try {
                const qs = new URLSearchParams({
                    per_page: String(perPage),
                    page: "1",
                });
                const res2 = await fetch(apiUrl(`/api/me/products?${qs.toString()}`), {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data2 = await res2.json().catch(() => ({}));
                if (res2.ok) {
                    setProducts(
                        Array.isArray(data2?.data)
                            ? data2.data
                            : Array.isArray(data2)
                                ? data2
                                : []
                    );
                    setMeta(data2?.meta || { current_page: 1, last_page: 1 });
                }
            } catch (err) {
                console.warn("Refresh after create failed:", err);
            }
        } catch (err) {
            setMsg(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    }

    // OPTIONAL: delete product (ensure backend checks owner)
    async function deleteProduct(p) {
        const freshToken =
            localStorage.getItem("token") || localStorage.getItem("access_token");

        if (!freshToken) {
            showToast("Please log in again");
            return;
        }
        if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(apiUrl(`/api/products/${p.id}`), {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${freshToken}`,
                    Accept: "application/json",
                },
            });

            // Try parse body (may be empty)
            let data = {};
            try { data = await res.json(); } catch {}

            if (!res.ok) {
                // Helpful messages per status
                if (res.status === 401) throw new Error("Unauthenticated. Please log in.");
                if (res.status === 403) throw new Error("You can only delete your own products.");
                if (res.status === 404) throw new Error("Product not found.");
                if (res.status === 405) throw new Error("Method not allowed. Check API route.");
                throw new Error(data?.message || `Delete failed (${res.status})`);
            }

            showToast("Deleted");
            setProducts((arr) => arr.filter((x) => x.id !== p.id));
        } catch (e) {
            console.error("Delete product error:", e);
            showToast(e.message || "Delete failed");
        }
    }


    const categoryOptions = useMemo(() => {
        const set = new Set(products.map((p) => p.category).filter(Boolean));
        ["Cakes", "Biscuits", "Cookies", "Bread", "Pastry"].forEach((c) =>
            set.add(c)
        );
        return Array.from(set).sort();
    }, [products]);

    return (
        <main style={{ padding: 24, width: "100%", maxWidth: 1100, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 16 }}>Owner Dashboard</h1>
            <p style={{ color: "#666", marginBottom: 20 }}>
                Create new products and manage your catalog.
            </p>

            {/* Uploader Card */}
            <section
                style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 1fr",
                    gap: 18,
                    alignItems: "start",
                    marginBottom: 28,
                }}
            >
                <form
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                    style={{
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: 16,
                        padding: 18,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    }}
                >
                    <h2 style={{ marginTop: 0, marginBottom: 12 }}>New Product</h2>

                    <Field label="Name" error={errors.name}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Chocolate Cake"
                            required
                            style={inputStyle}
                        />
                    </Field>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 12 }}>
                        <Field label="Category" error={errors.category}>
                            <input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                list="categories"
                                placeholder="Cakes"
                                style={inputStyle}
                            />
                            <datalist id="categories">
                                {categoryOptions.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </Field>
                        <Field label="Price (৳)" error={errors.price}>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="299.00"
                                required
                                style={inputStyle}
                            />
                        </Field>
                    </div>

                    <Field label="Description" error={errors.description}>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description…"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
            />
                    </Field>

                    <Field label="Image" error={errors.image}>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
                            }}
                            style={{
                                border: "2px dashed #cbd5e1",
                                borderRadius: 12,
                                padding: 16,
                                textAlign: "center",
                                background: "#f8fafc",
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{ display: "none" }}
                                id="file-input"
                            />
                            <label
                                htmlFor="file-input"
                                style={{ cursor: "pointer", color: "#0ea5e9", fontWeight: 600 }}
                            >
                                Click to choose an image
                            </label>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                                or drag & drop (jpg, png, webp, up to 5MB)
                            </div>
                        </div>
                    </Field>

                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 10,
                                border: "none",
                                background: loading ? "#94a3b8" : "#0ea5e9",
                                color: "#fff",
                                fontWeight: 700,
                            }}
                        >
                            {loading ? "Uploading..." : "Create Product"}
                        </button>
                        {msg && (
                            <span style={{ color: msg.includes("success") ? "green" : "#b91c1c" }}>
                {msg}
              </span>
                        )}
                    </div>
                </form>

                {/* Preview Card */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: 16,
                        padding: 18,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                    }}
                >
                    <h3 style={{ marginTop: 0, marginBottom: 12 }}>Preview</h3>
                    <div
                        style={{
                            width: "100%",
                            aspectRatio: "4/3",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 12,
                        }}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="preview"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <div style={{ color: "#94a3b8" }}>No image selected</div>
                        )}
                    </div>
                    <div style={{ display: "grid", gap: 6, fontSize: 14 }}>
                        <div>
                            <strong>{name || "—"}</strong>
                        </div>
                        <div style={{ color: "#64748b" }}>{category || "—"}</div>
                        <div style={{ fontWeight: 700 }}>৳ {price ? money(price) : "0.00"}</div>
                        <div style={{ color: "#475569" }}>
                            {description
                                ? description.length > 120
                                    ? description.slice(0, 120) + "…"
                                    : description
                                : "—"}
                        </div>
                    </div>
                </div>
            </section>

            {/* Catalog list */}
            <section>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <input
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search your products…"
                        style={{ ...inputStyle, maxWidth: 360 }}
                    />
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        style={{ ...inputStyle, width: 140 }}
                    >
                        {[6, 12, 24].map((n) => (
                            <option key={n} value={n}>
                                {n} / page
                            </option>
                        ))}
                    </select>
                </div>

                {products.length === 0 ? (
                    <div style={{ padding: 16, color: "#64748b" }}>No products yet.</div>
                ) : (
                    <>
                        <div
                            style={{
                                display: "grid",
                                gap: 16,
                                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                            }}
                        >
                            {products.map((p) => (
                                <article
                                    key={p.id}
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: 14,
                                        background: "#fff",
                                        padding: 12,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100%",
                                            aspectRatio: "4/3",
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            background: "#f8fafc",
                                        }}
                                    >
                                        {p.image_url ? (
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    color: "#94a3b8",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    height: "100%",
                                                }}
                                            >
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: "grid", gap: 4 }}>
                                        <strong>{p.name}</strong>
                                        <div style={{ color: "#64748b", fontSize: 13 }}>
                                            {p.category || "—"}
                                        </div>
                                        <div style={{ fontWeight: 700 }}>৳ {money(p.price)}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                                        <button
                                            onClick={() => deleteProduct(p)}
                                            style={{
                                                flex: 1,
                                                padding: "8px 10px",
                                                borderRadius: 10,
                                                border: "1px solid #ef4444",
                                                background: "#fff",
                                                color: "#ef4444",
                                                fontWeight: 700,
                                            }}
                                            title="Delete product"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                style={pgBtnStyle(page <= 1)}
                            >
                                ← Prev
                            </button>
                            <div style={{ padding: "8px 12px" }}>
                                Page {meta.current_page ?? page} of {meta.last_page ?? 1}
                            </div>
                            <button
                                disabled={(meta.current_page ?? page) >= (meta.last_page ?? 1)}
                                onClick={() => setPage((p) => p + 1)}
                                style={pgBtnStyle((meta.current_page ?? page) >= (meta.last_page ?? 1))}
                            >
                                Next →
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* Toast */}
            <div
                style={{
                    position: "fixed",
                    bottom: 24,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#111",
                    color: "#fff",
                    opacity: toast.show ? 1 : 0,
                    transition: "opacity .25s",
                    pointerEvents: "none",
                }}
            >
                {toast.text}
            </div>
            <ChatWidget title="Smart Bakery AI (Owner)" subtitle="Ask about revenue, orders & inventory" />

        </main>
    );
}

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 6 }}>
                {label}
            </label>
            {children}
            {error ? (
                <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>{error}</div>
            ) : null}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    outline: "none",
};

function pgBtnStyle(disabled) {
    return {
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: disabled ? "#f5f5f5" : "#fff",
        color: disabled ? "#999" : "#111",
        cursor: disabled ? "not-allowed" : "pointer",
        minWidth: 88,
        fontWeight: 600,
    };
}

function flattenLaravelErrors(e = {}) {
    const out = {};
    Object.entries(e).forEach(([k, v]) => {
        out[k] = Array.isArray(v) ? v[0] : String(v);
    });
    return out;
}
