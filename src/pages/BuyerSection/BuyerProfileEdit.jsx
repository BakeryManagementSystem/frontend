import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";
const apiUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);

export default function BuyerProfileEdit() {
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
        name: "",
        email: "",
        address: "",
        facebook_url: "",
        photo_url: "",
    });

    useEffect(() => {
        if (!token) { navigate("/auth"); return; }
        let cancel = false;
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(apiUrl("/api/me/profile"), {
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || "Failed to load profile");
                if (cancel) return;
                setForm({
                    name: data.name ?? "",
                    email: data.email ?? "",
                    address: data.address ?? "",
                    facebook_url: data.facebook_url ?? "",
                    photo_url: data.photo_url ?? "",
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
            // server fields
            if (form.address) fd.append("address", form.address);
            if (form.facebook_url) fd.append("facebook_url", form.facebook_url);
            if (file) fd.append("photo", file);
            // optionally allow name/email updates too (uncomment if supported server-side)
            if (form.name) fd.append("name", form.name);
            if (form.email) fd.append("email", form.email);

            const res = await fetch(apiUrl("/api/me/profile"), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to update");

            setMsg("Saved!");
            // back to view page
            navigate("/profile");
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
                    <button className="btn btn-ghost" onClick={() => navigate("/profile")}>← Back</button>
                    <h1>Edit Profile</h1>
                    <div />
                </div>

                <div className="edit-grid">
                    <Field label="Full Name">
                        <input
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Your name"
                        />
                    </Field>

                    <Field label="Email">
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="you@example.com"
                        />
                    </Field>

                    <Field label="Address">
                        <input
                            value={form.address}
                            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                            placeholder="Delivery address"
                        />
                    </Field>

                    <Field label="Facebook URL">
                        <input
                            value={form.facebook_url}
                            onChange={(e) => setForm((p) => ({ ...p, facebook_url: e.target.value }))}
                            placeholder="https://facebook.com/your.profile"
                        />
                    </Field>

                    <Field label="Photo">
                        <div className="upload-box">
                            <label className="btn" htmlFor="photo">Choose image</label>
                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                style={{ display: "none" }}
                            />
                            <div className="upload-preview">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="preview" />
                                ) : form.photo_url ? (
                                    <img src={form.photo_url} alt="avatar" />
                                ) : (
                                    <span className="avatar-fallback">👤</span>
                                )}
                            </div>
                        </div>
                    </Field>
                </div>

                {msg && <div className="muted" style={{ marginTop: 8 }}>{msg}</div>}
                <div className="form-actions">
                    <button className="btn btn-ghost" onClick={() => navigate("/profile")} disabled={loading}>Cancel</button>
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
