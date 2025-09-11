import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";
const apiUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);

export default function OwnerShopProfileEdit() {
    const navigate = useNavigate();
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        "";

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [form, setForm] = useState({
        shop_name: "",
        address: "",
        facebook_url: "",
        logo_url: "",
    });

    useEffect(() => {
        if (!token) { navigate("/auth"); return; }
        let cancel = false;
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(apiUrl("/api/owner/shop"), {
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || "Failed to load shop");
                if (cancel) return;
                setForm({
                    shop_name: data.shop_name ?? "",
                    address: data.address ?? "",
                    facebook_url: data.facebook_url ?? "",
                    logo_url: data.logo_url ?? "",
                });
            } catch (e) {
                if (!cancel) setMsg(e.message || "Error");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, [token, navigate]);

    useEffect(() => {
        if (!file) { setPreviewUrl(""); return; }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    async function save() {
        setLoading(true);
        setMsg("");
        try {
            const fd = new FormData();
            if (form.shop_name) fd.append("shop_name", form.shop_name);
            if (form.address) fd.append("address", form.address);
            if (form.facebook_url) fd.append("facebook_url", form.facebook_url);
            if (file) fd.append("logo", file);

            const res = await fetch(apiUrl("/api/owner/shop"), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Update failed");

            setMsg("Saved!");
            navigate("/owner/shop");
        } catch (e) {
            setMsg(e.message || "Save failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="profile-shell">
            <div className="profile-card">
                <div className="profile-hero">
                    <button className="btn btn-ghost" onClick={() => navigate("/owner/shop")}>← Back</button>
                    <h1>Edit Shop</h1>
                    <div />
                </div>

                <div className="edit-grid">
                    <Field label="Shop Name">
                        <input
                            value={form.shop_name}
                            onChange={(e) => setForm((p) => ({ ...p, shop_name: e.target.value }))}
                            placeholder="Smart Bakery"
                        />
                    </Field>

                    <Field label="Address">
                        <input
                            value={form.address}
                            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                            placeholder="Shop address"
                        />
                    </Field>

                    <Field label="Facebook URL">
                        <input
                            value={form.facebook_url}
                            onChange={(e) => setForm((p) => ({ ...p, facebook_url: e.target.value }))}
                            placeholder="https://facebook.com/your.shop"
                        />
                    </Field>

                    <Field label="Logo">
                        <div className="upload-box">
                            <label className="btn" htmlFor="logo">Choose logo</label>
                            <input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{ display: "none" }}
                            />
                            <div className="upload-preview">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="preview" />
                                ) : form.logo_url ? (
                                    <img src={form.logo_url} alt="logo" />
                                ) : (
                                    <span className="avatar-fallback">🏪</span>
                                )}
                            </div>
                        </div>
                    </Field>
                </div>

                {msg && <div className="muted" style={{ marginTop: 8 }}>{msg}</div>}
                <div className="form-actions">
                    <button className="btn btn-ghost" onClick={() => navigate("/owner/shop")} disabled={loading}>Cancel</button>
                    <button className="btn" onClick={save} disabled={loading}>
                        {loading ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </main>
    );
}

function Field({ label, children }) {
    return (
        <div className="field">
            <div className="info-label">{label}</div>
            <div className="field-control">{children}</div>
        </div>
    );
}
