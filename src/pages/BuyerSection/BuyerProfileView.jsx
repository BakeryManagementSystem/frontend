import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";
const apiUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);

export default function BuyerProfileView() {
    const navigate = useNavigate();
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        "";
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [profile, setProfile] = useState({
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
                setProfile({
                    name: data.name ?? "",
                    email: data.email ?? "",
                    address: data.address ?? "",
                    facebook_url: data.facebook_url ?? "",
                    photo_url: data.photo_url ?? "",
                });
            } catch (e) {
                if (!cancel) setErr(e.message || "Error");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, [token, navigate]);

    if (loading) return <div className="profile-shell">Loading…</div>;
    if (err) return <div className="profile-shell error">{err}</div>;

    return (
        <main className="profile-shell">
            <div className="profile-card">
                <div className="profile-hero">
                    <div className="avatar">
                        {profile.photo_url
                            ? <img src={profile.photo_url} alt="avatar" />
                            : <span className="avatar-fallback">👤</span>}
                    </div>
                    <div className="hero-text">
                        <h1>{profile.name || "—"}</h1>
                        <p className="muted">{profile.email || "—"}</p>
                    </div>
                    <div className="hero-actions">
                        <button className="btn" onClick={() => navigate("/profile/edit")}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                <div className="profile-grid">
                    <InfoRow label="Full Name" value={profile.name} />
                    <InfoRow label="Email" value={profile.email} />
                    <InfoRow label="Address" value={profile.address} />
                    <InfoRow
                        label="Facebook"
                        value={
                            profile.facebook_url ? (
                                <a href={profile.facebook_url} target="_blank" rel="noreferrer">
                                    {profile.facebook_url}
                                </a>
                            ) : "—"
                        }
                    />
                </div>
            </div>
        </main>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="info-row">
            <div className="info-label">{label}</div>
            <div className="info-value">{value || "—"}</div>
        </div>
    );
}
