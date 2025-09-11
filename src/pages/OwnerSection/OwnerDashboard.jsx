import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function StatCard({ label, value, hint }) {
    return (
        <div className="od-card">
            <div className="od-val">{value}</div>
            <div className="od-lbl">{label}</div>
            {hint && <div className="od-hint">{hint}</div>}
        </div>
    );
}

export default function OwnerDashboard() {
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [from, setFrom] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
    const [to, setTo] = useState(() => new Date().toISOString().slice(0,10));

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [data, setData] = useState({
        sales_count: 0,
        sales_amount: 0,
        product_breakdown: [],     // [{product, qty, revenue}]
        category_breakdown: [],    // [{category, qty, revenue}]
        ingredient_usage: [],      // [{ingredient, quantity, cost}]
        ingredient_cost: 0,
        profit: 0,
    });

    async function load() {
        try {
            setLoading(true); setErr("");
            const qs = `?from=${from}&to=${to}`;
            const res = await fetch(`${API_BASE}/api/owner/dashboard${qs}`, {
                headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(j?.message || "Failed to load");

            // Normalize fields
            setData({
                sales_count: j?.sales_count ?? 0,
                sales_amount: j?.sales_amount ?? 0,
                product_breakdown: j?.product_breakdown ?? [],
                category_breakdown: j?.category_breakdown ?? [],
                ingredient_usage: j?.ingredient_usage ?? [],
                ingredient_cost: j?.ingredient_cost ?? 0,
                profit: j?.profit ?? ( (j?.sales_amount ?? 0) - (j?.ingredient_cost ?? 0) ),
            });
        } catch (e) {
            setErr(e.message || "Failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
    useEffect(() => { load(); /* eslint-disable-next-line */ }, [from, to]);

    return (
        <main className="od-wrap">
            <section className="od-head">
                <h2>Dashboard</h2>
                <div className="od-range">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    <span>→</span>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
            </section>

            {loading && <div className="od-note">Loading…</div>}
            {err && !loading && <div className="od-err">{err}</div>}

            {!loading && !err && (
                <>
                    <section className="od-stats">
                        <StatCard label="Total Orders" value={data.sales_count} />
                        <StatCard label="Revenue" value={`৳${Number(data.sales_amount).toLocaleString()}`} />
                        <StatCard label="Ingredient Cost" value={`৳${Number(data.ingredient_cost).toLocaleString()}`} />
                        <StatCard label="Profit" value={`৳${Number(data.profit).toLocaleString()}`} />
                    </section>

                    <section className="od-panels">
                        <div className="od-panel">
                            <h3>By Category</h3>
                            <div className="od-table">
                                <div className="od-row od-row--head">
                                    <div>Category</div><div>Qty</div><div>Revenue</div>
                                </div>
                                {data.category_breakdown.map((r, i) => (
                                    <div className="od-row" key={i}>
                                        <div>{r.category || "—"}</div>
                                        <div>{r.qty}</div>
                                        <div>৳{Number(r.revenue).toLocaleString()}</div>
                                    </div>
                                ))}
                                {data.category_breakdown.length === 0 && <div className="od-empty">No data</div>}
                            </div>
                        </div>

                        <div className="od-panel">
                            <h3>Top Products</h3>
                            <div className="od-table">
                                <div className="od-row od-row--head">
                                    <div>Product</div><div>Qty</div><div>Revenue</div>
                                </div>
                                {data.product_breakdown.map((r, i) => (
                                    <div className="od-row" key={i}>
                                        <div>{r.product || "—"}</div>
                                        <div>{r.qty}</div>
                                        <div>৳{Number(r.revenue).toLocaleString()}</div>
                                    </div>
                                ))}
                                {data.product_breakdown.length === 0 && <div className="od-empty">No data</div>}
                            </div>
                        </div>

                        <div className="od-panel od-panel--full">
                            <h3>Ingredient Usage</h3>
                            <div className="od-table">
                                <div className="od-row od-row--head">
                                    <div>Ingredient</div><div>Quantity</div><div>Cost</div>
                                </div>
                                {data.ingredient_usage.map((r, i) => (
                                    <div className="od-row" key={i}>
                                        <div>{r.ingredient || "—"}</div>
                                        <div>{r.quantity}</div>
                                        <div>৳{Number(r.cost).toLocaleString()}</div>
                                    </div>
                                ))}
                                {data.ingredient_usage.length === 0 && <div className="od-empty">No data</div>}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
