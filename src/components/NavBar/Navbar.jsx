import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"; // or "@/context/AuthContext.jsx" if you set the alias
import NabIconLink from "./NabIconLink.jsx";
import "./Navbar.css";

function getInitials(name = "") {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || null;
}

export default function Navbar({ onLeftIconClick }) {
    // Demo counters; replace with live counts later
    const [cartCount] = useState(0);
    const [notifCount] = useState(0);

    const navigate = useNavigate();

    // ✅ Proper auth hook usage
    const { isAuthenticated, user } = useAuth();

    // Fallback token if context hasn’t hydrated yet (after refresh)
    const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

    // Live role/name: prefer context; fall back to localStorage
    const role = useMemo(() => {
        const r = (user?.user_type || localStorage.getItem("user_type") || "buyer").toLowerCase();
        // Treat "seller" same as "owner" in your app
        return r === "seller" ? "owner" : r;
    }, [user?.user_type]);

    const userName = useMemo(() => {
        return user?.name || localStorage.getItem("name") || localStorage.getItem("user_name") || "";
    }, [user?.name]);

    const initials = getInitials(userName);

    // Destinations
    const goHome = () => {
        if (role === "owner") navigate("/owner");
        else navigate("/buyer"); // or "/shop" if that’s your buyer home
    };

    const handleProfileClick = () => {
        if (isAuthenticated || token) {
            if (role === "owner") navigate("/owner/shop");
            else navigate("/profile");
        } else {
            navigate("/auth"); // go to Login page (not Sign Up)
        }
    };

    const onSearchKey = (e) => {
        const v = e.currentTarget.value.trim();
        if (e.key === "Enter" && v) {
            const q = encodeURIComponent(v);
            if (role === "owner") navigate(`/owner?q=${q}`);
            else navigate(`/shop?q=${q}`);
        }
    };

    return (
        <nav className="nav">
            <div className="nav-container">
                <div className="nav-row">
                    {/* Left: Menu/List icon */}
                    <div className="nav-left">
                        <button
                            className="nav-icon-btn"
                            onClick={onLeftIconClick}
                            aria-label="Open menu"
                            title="Menu"
                        >
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Center: role-specific actions */}
                    <div className="nav-center">
                        {/* Home */}
                        <button className="nav-icon-btn" onClick={goHome} aria-label="Home" title="Home">
                            <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                            </svg>
                        </button>

                        {role === "buyer" ? (
                            <>
                                {/* Cart */}
                                <NabIconLink to="/cart" label="Cart" badge={cartCount}>
                                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                                    </svg>
                                </NabIconLink>

                                {/* Search */}
                                <div className="nav-search">
                                    <input
                                        type="text"
                                        placeholder="Search bakery items..."
                                        onKeyDown={onSearchKey}
                                    />
                                    <svg className="nav-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Messages */}
                                <NabIconLink to="/messages" label="Messages">
                                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </NabIconLink>
                            </>
                        ) : (
                            <>
                                {/* Owner: Dashboard */}
                                <NabIconLink to="/owner/dashboard" label="Dashboard">
                                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4v11H3V10zm7-7h4v18h-4V3zm7 11h4v7h-4v-7z" />
                                    </svg>
                                </NabIconLink>

                                {/* Owner: Attachments (placeholder) */}
                                <NabIconLink to="/owner/ingredients/upload" label="Attachments">
                                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79V8a5 5 0 00-9.58-1.65M5 13l4 4L19 7" />
                                    </svg>
                                </NabIconLink>

                                {/* Owner: Messages */}
                                <NabIconLink to="/messages" label="Messages">
                                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </NabIconLink>

                                {/* Owner: Inbox (placeholder -> reuse /messages) */}
                                <NabIconLink to="/owner/inbox" label="Inbox">
                                    <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 7l3 10a2 2 0 002 2h8a2 2 0 002-2l3-10M3 7h18M7 7v-.5a2.5 2.5 0 115 0V7" />
                                    </svg>
                                </NabIconLink>
                            </>
                        )}

                        {/* Notifications (both roles) */}
                        <NabIconLink to="/notifications" label="Notifications" badge={notifCount}>
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </NabIconLink>
                    </div>

                    {/* Right: Profile / Shop Profile */}
                    <div className="nav-right">
                        <button
                            className="nav-icon-btn nav-icon-btn--avatar"
                            onClick={handleProfileClick}
                            aria-label={role === "owner" ? "Shop Profile" : "Profile"}
                            title={role === "owner" ? "Shop Profile" : "Profile"}
                        >
                            {role === "owner" ? (
                                // shop/profile icon
                                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l1 12a2 2 0 002 2h12a2 2 0 002-2l1-12M5 7l2-4h10l2 4M7 10h10" />
                                </svg>
                            ) : (
                                // user/profile icon
                                <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}

                            {/* initials bubble when logged in */}
                            {(isAuthenticated || token) && initials && (
                                <span className="nav-avatar-badge" aria-hidden="true">
                  {initials}
                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
