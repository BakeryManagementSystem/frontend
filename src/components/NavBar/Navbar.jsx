import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NabIconLink from "./NabIconLink.jsx";
import "./Navbar.css";

export default function Navbar({ onLeftIconClick }) {
    const [cartCount] = useState(3);
    const [notifCount] = useState(2);
    const navigate = useNavigate();

    const goHome = () => navigate("/");
    const goToProfile = () => navigate("/profile");

    return (
        <nav className="nav">
            <div className="nav-container">
                <div className="nav-row">
                    {/* Left section */}
                    <div className="nav-left">
                        <button className="nav-icon-btn" onClick={onLeftIconClick} aria-label="Open menu" title="Menu">
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Center section */}
                    <div className="nav-center">
                        {/* Home button */}
                        <button className="nav-icon-btn" onClick={goHome} aria-label="Home" title="Home">
                            <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path>
                            </svg>
                        </button>

                        {/* Cart link */}
                        <NabIconLink to="/cart" label="Cart" badge={cartCount}>
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"></path>
                            </svg>
                        </NabIconLink>

                        {/* Search bar */}
                        <div className="nav-search">
                            <input
                                type="text"
                                placeholder="Search bakery items..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                        const q = encodeURIComponent(e.currentTarget.value.trim());
                                        navigate(`/shop?q=${q}`);
                                    }
                                }}
                            />
                            <svg className="nav-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>

                        {/* Messages link */}
                        <NabIconLink to="/messages" label="Messages">
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                        </NabIconLink>
                    </div>

                    {/* Right section */}
                    <div className="nav-right">
                        <NabIconLink to="/notifications" label="Notifications" badge={notifCount}>
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </NabIconLink>

                        <button className="nav-icon-btn" onClick={goToProfile} aria-label="Profile" title="Profile">
                            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
