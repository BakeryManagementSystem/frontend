import { useEffect, useMemo, useState } from "react";
import "./IngredientUploadPage.css";
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function IngredientUploadPage() {
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    // list of known ingredients (id, name, unit)
    const [ingredients, setIngredients] = useState([]);

    // production period
    const today = new Date().toISOString().slice(0, 10);
    const [periodStart, setPeriodStart] = useState(today);
    const [periodEnd, setPeriodEnd] = useState(today);


    // batch meta
    const [batchDate, setBatchDate] = useState(() =>
        new Date().toISOString().slice(0, 10)
    );

    //category+note
    const [category, setCategory] = useState("cake"); // cake/biscuits/cookies/bread
    const [note, setNote] = useState("");

    // items rows: [{ingredient_id, quantity, unit_cost}]
    const [rows, setRows] = useState([
        { ingredient_id: "", quantity: "", unit_cost: "" },
    ]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/ingredients`, {
                    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
                });
                const data = await res.json().catch(() => []);
                setIngredients(Array.isArray(data) ? data : data?.data || []);
            } catch {
                // silent
            }
        })();
    }, [token]);

    const addRow = () =>
        setRows((r) => [...r, { ingredient_id: "", quantity: "", unit_cost: "" }]);
    const delRow = (idx) => setRows((r) => r.filter((_, i) => i !== idx));
    const setRow = (idx, key, val) =>
        setRows((r) => r.map((row, i) => (i === idx ? { ...row, [key]: val } : row)));

    // Live totals (UI only)
    const { lineTotals, totalCost } = useMemo(() => {
        const lt = rows.map((r) => {
            const q = parseFloat(r.quantity) || 0;
            const c = parseFloat(r.unit_cost) || 0;
            return q * c;
        });
        const t = lt.reduce((a, b) => a + b, 0);
        return { lineTotals: lt, totalCost: t };
    }, [rows]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");

        // basic validation
        if (!periodStart || !periodEnd) {
            setErr("Please choose a From and To date.");
            return;
        }
        if (periodEnd < periodStart) {
            setErr("End date cannot be earlier than start date.");
            return;
        }

        // validation (unchanged)
        const cleanItems = rows
               .map(r => ({
                 ingredient_id: Number(r.ingredient_id),
                 // API expects these exact keys:
                     quantity_used: Number(r.quantity),
                 unit_price_snapshot: Number(r.unit_cost),
               }))
           .filter(it => it.ingredient_id && it.quantity_used > 0 && it.unit_price_snapshot >= 0);

        if (cleanItems.length === 0) {
            setErr("Add at least one valid row.");
            return;
        }

        const payload = {
            category,
            period_start: periodStart,
            period_end: periodEnd,
            batch_date: batchDate,
            note: note || null,
            items: cleanItems,
        };

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/owner/ingredient-batches`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.message || "Failed to save batch");

            setMsg("✅ Ingredient batch saved.");
            setRows([{ ingredient_id: "", quantity: "", unit_cost: "" }]);
            setNote("");
        } catch (e) {
            setErr(e.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="ib-wrap">
            {/* Header */}
            <section className="ib-head">
                <div className="ib-head-left">
                    <h2>Ingredient Usage</h2>
                    <p className="ib-sub">Log the total ingredients used for a production period.</p>
                </div>
                <div className="ib-head-right">
                    <div className="ib-summary-pill" title="Live estimated cost">
                        <span className="ib-summary-label">Estimated Cost</span>
                        <span className="ib-summary-value">
              ৳ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
                    </div>
                </div>
            </section>

            <form className="ib-form" onSubmit={onSubmit}>
                {/* Meta */}
                <div className="ib-grid">
                    <div className="ib-field">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="ib-input"
                        >
                            <option value="cake">Cake</option>
                            <option value="biscuits">Biscuits</option>
                            <option value="cookies">Cookies</option>
                            <option value="bread">Bread</option>
                        </select>
                    </div>

                    <div className="ib-field">
                        <label>Batch Date</label>
                        <input
                            type="date"
                            value={batchDate}
                            onChange={(e) => setBatchDate(e.target.value)}
                            className="ib-input"
                        />
                    </div>

                    {/* NEW: Date range for the batch */}
                    <div className="ib-field">
                        <label>From</label>
                        <input
                            type="date"
                            value={periodStart}
                            onChange={(e) => setPeriodStart(e.target.value)}
                        />
                    </div>
                    <div className="ib-field">
                        <label>To</label>
                        <input
                            type="date"
                            value={periodEnd}
                            onChange={(e) => setPeriodEnd(e.target.value)}
                        />
                    </div>


                    <div className="ib-field ib-field--full">
                        <label>Note (optional)</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g., Morning production run"
                            className="ib-input"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="ib-table">
                    <div className="ib-row ib-row--head">
                        <div>Ingredient</div>
                        <div>Quantity</div>
                        <div>Unit Cost(snapshot)</div>
                        <div className="ib-col-right">Line Total</div>
                        <div></div>
                    </div>

                    {rows.map((r, idx) => (
                        <div className="ib-row" key={idx}>
                            <div>
                                <select
                                    value={r.ingredient_id}
                                    onChange={(e) => setRow(idx, "ingredient_id", e.target.value)}
                                    className="ib-input"
                                >
                                    <option value="">Select Ingredient</option>
                                    {ingredients.map((ing) => (
                                        <option key={ing.id} value={ing.id}>
                                            {ing.name} {ing.unit ? `(${ing.unit})` : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={r.quantity}
                                    onChange={(e) => setRow(idx, "quantity", e.target.value)}
                                    placeholder="e.g., 2.5"
                                    className="ib-input"
                                />
                            </div>

                            <div>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={r.unit_cost}
                                    onChange={(e) => setRow(idx, "unit_cost", e.target.value)}
                                    placeholder="e.g., 80"
                                    className="ib-input"
                                />
                            </div>

                            <div className="ib-col-right ib-line-total">
                                ৳ {(lineTotals[idx] || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>

                            <div className="ib-actions-col">
                                {rows.length > 1 && (
                                    <button
                                        type="button"
                                        className="ib-icon-btn ib-del"
                                        onClick={() => delRow(idx)}
                                        aria-label="Remove row"
                                        title="Remove row"
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="ib-footer">
                    <div className="ib-footer-left">
                        <button type="button" className="ib-btn" onClick={addRow}>
                            + Add Row
                        </button>
                    </div>

                    <div className="ib-footer-right">
                        <div className="ib-total">
                            <div className="ib-total-label">Estimated Total</div>
                            <div className="ib-total-value">
                                ৳ {totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                        </div>
                        <button type="submit" className="ib-btn ib-btn--primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Batch"}
                        </button>
                    </div>
                </div>

                {msg && <div className="ib-msg ok">{msg}</div>}
                {err && <div className="ib-msg err">{err}</div>}
            </form>
        </main>
    );
}
