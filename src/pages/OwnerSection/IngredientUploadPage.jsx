import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function IngredientUploadPage() {
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    // list of known ingredients (id, name, unit)
    const [ingredients, setIngredients] = useState([]);

    // batch meta
    const [batchDate, setBatchDate] = useState(() => new Date().toISOString().slice(0,10));
    const [category, setCategory] = useState("cake"); // or biscuits/cookies/bread etc
    const [note, setNote] = useState("");

    // items rows: [{ingredient_id, quantity, unit_cost}]
    const [rows, setRows] = useState([{ ingredient_id: "", quantity: "", unit_cost: "" }]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/ingredients`, {
                    headers: { Accept: "application/json", Authorization: `Bearer ${token}` }
                });
                const data = await res.json().catch(() => ([]));
                setIngredients(Array.isArray(data) ? data : (data?.data || []));
            } catch {
                // silent
            }
        })();
    }, [token]);

    const addRow = () => setRows((r) => [...r, { ingredient_id: "", quantity: "", unit_cost: "" }]);
    const delRow = (idx) => setRows((r) => r.filter((_, i) => i !== idx));
    const setRow = (idx, key, val) => setRows((r) => r.map((row, i) => i === idx ? { ...row, [key]: val } : row));

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg(""); setErr("");
        // basic validation
        const cleanItems = rows
            .map(r => ({
                ingredient_id: Number(r.ingredient_id),
                quantity: Number(r.quantity),
                unit_cost: Number(r.unit_cost),
            }))
            .filter(it => it.ingredient_id && it.quantity > 0 && it.unit_cost >= 0);

        if (cleanItems.length === 0) {
            setErr("Add at least one valid row.");
            return;
        }

        const payload = {
            category,                // cake/biscuits/cookies/bread etc
            batch_date: batchDate,   // optional
            note: note || null,
            items: cleanItems,
        };

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/ingredient-batches`, {
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
            <section className="ib-head">
                <h2>Add Ingredient Usage</h2>
            </section>

            <form className="ib-form" onSubmit={onSubmit}>
                <div className="ib-grid">
                    <div className="ib-field">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="cake">Cake</option>
                            <option value="biscuits">Biscuits</option>
                            <option value="cookies">Cookies</option>
                            <option value="bread">Bread</option>
                        </select>
                    </div>
                    <div className="ib-field">
                        <label>Batch Date</label>
                        <input type="date" value={batchDate} onChange={(e) => setBatchDate(e.target.value)} />
                    </div>
                    <div className="ib-field ib-field--full">
                        <label>Note (optional)</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g., morning production run" />
                    </div>
                </div>

                <div className="ib-table">
                    <div className="ib-row ib-row--head">
                        <div>Ingredient</div>
                        <div>Quantity</div>
                        <div>Unit Cost</div>
                        <div></div>
                    </div>
                    {rows.map((r, idx) => (
                        <div className="ib-row" key={idx}>
                            <div>
                                <select value={r.ingredient_id} onChange={(e) => setRow(idx, "ingredient_id", e.target.value)}>
                                    <option value="">Select Ingredient</option>
                                    {ingredients.map((ing) => (
                                        <option key={ing.id} value={ing.id}>{ing.name} {ing.unit ? `(${ing.unit})` : ""}</option>
                                    ))}
                                </select>
                            </div>
                            <div><input type="number" min="0" step="0.01" value={r.quantity} onChange={(e) => setRow(idx, "quantity", e.target.value)} placeholder="e.g., 2.5" /></div>
                            <div><input type="number" min="0" step="0.01" value={r.unit_cost} onChange={(e) => setRow(idx, "unit_cost", e.target.value)} placeholder="e.g., 80" /></div>
                            <div>
                                {rows.length > 1 && <button type="button" className="ib-del" onClick={() => delRow(idx)}>✖</button>}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ib-actions">
                    <button type="button" className="ib-btn" onClick={addRow}>+ Add Row</button>
                    <button type="submit" className="ib-btn ib-btn--primary" disabled={loading}>{loading ? "Saving..." : "Save Batch"}</button>
                </div>

                {msg && <div className="ib-msg ok">{msg}</div>}
                {err && <div className="ib-msg err">{err}</div>}
            </form>
        </main>
    );
}
