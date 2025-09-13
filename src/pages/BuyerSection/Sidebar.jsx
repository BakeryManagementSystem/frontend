import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const links = [
    { to: "/orders", label: "Orders", icon: "orders" },
    { to: "/owner/orders", label: "Order Status", icon: "status" },
    { to: "/reviews", label: "Reviews", icon: "review" },
    { to: "/settings", label: "Settings", icon: "settings" },
    { to: "/help", label: "Help", icon: "help" },
];

function Icon({ name }) {
    switch (name) {
        case "shop":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        case "cart":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            );
        case "orders":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            );
        case "status":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case "notifications":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            );
        case "messages":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            );
        case "review":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            );
        case "settings":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            );
        case "help":
            return (
                <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        default:
            return null;
    }
}

export default function Sidebar({ open, onClose }) {
    const panelRef = useRef(null);
    const navigate = useNavigate();

    // close on Esc
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // trap initial focus
    useEffect(() => {
        if (open && panelRef.current) panelRef.current.focus();
    }, [open]);

    const logout = () => {
        localStorage.removeItem("access_token");
        onClose();
        navigate("/auth");
    };

    return (
        <>
            <div className={`sb-backdrop ${open ? "show" : ""}`} onClick={onClose} />
            <aside
                className={`sb-panel ${open ? "open" : ""}`}
                tabIndex={-1}
                ref={panelRef}
                aria-hidden={!open}
                aria-label="Sidebar"
            >
                <header className="sb-header">
                    <div className="sb-title">Smart Bakery</div>
                    <button className="sb-close" onClick={onClose} aria-label="Close">✕</button>
                </header>

                <nav className="sb-nav">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) => "sb-link" + (isActive ? " active" : "")}
                            onClick={onClose}
                        >
                            <Icon name={l.icon} />
                            <span>{l.label}</span>
                        </NavLink>
                    ))}

                    <button className="sb-link logout" onClick={logout}>
                        <svg viewBox="0 0 24 24" className="sb-icon" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                  d="M10 17l5-5m0 0l-5-5m5 5H3m11-7h4a2 2 0 012 2v10a2 2 0 01-2 2h-4"/>
                        </svg>
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>
        </>
    );
}
