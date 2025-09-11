// src/pages/BuyerSection/ProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./ProfilePage.css";

const API_BASE = import.meta.env.VITE_API_URL || "";
const apiUrl = (p) => (API_BASE ? `${API_BASE}${p}` : p);

export default function ProfilePage() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!token) { navigate("/auth"); return; }
        let cancel = false;
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(apiUrl("/api/me/profile"), {
                    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.message || "Failed to load profile");
                if (!cancel) setProfile(data);
            } catch (e) {
                if (!cancel) setMsg(e.message || "Error loading profile");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, [token, navigate]);

    // Fallbacks from auth/localStorage
    const displayName = profile?.name || user?.name || localStorage.getItem("name") || "Your Name";
    const displayEmail = profile?.email || user?.email || localStorage.getItem("email") || "you@example.com";
    const userType = useMemo(
        () => (user?.user_type || localStorage.getItem("user_type") || "buyer").toLowerCase(),
        [user?.user_type]
    );

    const initials = useMemo(() => {
        const parts = String(displayName).trim().split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] ?? "";
        const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
        return (first + last).toUpperCase() || "U";
    }, [displayName]);

    const onLogout = () => {
        logout?.();
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        navigate("/auth");
    };

    return (
        <main className="p-main">
            <section className="p-shell">
                <div className="p-topbar">
                    <div className="p-title">
                        <h1>My Profile</h1>
                        <span className={`p-role p-role--${userType}`}>{userType}</span>
                    </div>
                    <div className="p-actions">
                        <Link to="/profile/edit" className="btn btn-primary">Edit Profile</Link>
                        <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
                    </div>
                </div>

                <div className="p-cover">
                    <div className="p-cover-overlay" />
                    <div className="p-avatar" aria-label="Profile avatar">
                        {profile?.photo_url ? (
                            <img className="p-avatar-img" src={profile.photo_url} alt="avatar" />
                        ) : (
                            <div className="p-avatar-circle">{initials}</div>
                        )}
                    </div>
                </div>

                {msg && <div className="p-error">{msg}</div>}

                <div className="p-card">
                    <div className="p-card-header"><h2>Account</h2></div>
                    <div className="p-grid">
                        <div className="p-field">
                            <label>Full Name</label>
                            <div className="p-value">{displayName}</div>
                        </div>
                        <div className="p-field">
                            <label>Email</label>
                            <div className="p-value">{displayEmail}</div>
                        </div>
                        <div className="p-field">
                            <label>Role</label>
                            <div className="p-value">{userType}</div>
                        </div>
                        <div className="p-field">
                            <label>Address</label>
                            <div className="p-value">{profile?.address || "—"}</div>
                        </div>
                        <div className="p-field">
                            <label>Facebook</label>
                            <div className="p-value">
                                {profile?.facebook_url ? (
                                    <a href={profile.facebook_url} target="_blank" rel="noreferrer">{profile.facebook_url}</a>
                                ) : "—"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* (Quick Links and Stats… keep your existing markup) */}
            </section>
        </main>
    );
}
