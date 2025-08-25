import "./BuyerPage.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function BuyerPage() {
    const [cartCount, setCartCount] = useState(3);
    const [toast, setToast] = useState({ show: false, text: "" });
    const location = useLocation();

    const showToast = (text) => {
        setToast({ show: true, text });
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => setToast({ show: false, text: "" }), 3000);
    };

    const addToCart = (item) => {
        setCartCount((c) => c + 1);
        showToast(`${item} added to cart!`);
    };
    const orderNow = (item) => showToast(`Processing order for ${item}...`);

    // Optional: read search query
    const params = new URLSearchParams(location.search);
    const q = params.get("q");

    return (
        <div className="container main">
            <section className="welcome">
                <h1 className="welcome-title">Welcome to Smart Bakery</h1>
                <p className="welcome-sub">
                    {q ? <>Results for: <strong>{q}</strong></> : "Fresh baked goods delivered to your door"}
                </p>
            </section>

            <section className="grid">
                {[
                    { name: "Fresh Croissant", price: "$3.50", emoji: "✔️", icon: true },
                    { name: "Chocolate Cake", price: "$25.99", emoji: "🎂" },
                    { name: "Artisan Bread", price: "$4.75", emoji: "🍞" },
                    { name: "Blueberry Muffin", price: "$2.25", emoji: "🧁" },
                    { name: "Danish Pastry", price: "$3.99", emoji: "🥐" },
                    { name: "Sourdough Loaf", price: "$6.50", emoji: "🍞" },
                ].map((it) => (
                    <article key={it.name} className="item-card">
                        <div className="item-top">
                            <div className="item-circle">
                                {it.icon ? (
                                    <svg className="item-circle-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                ) : (
                                    <span className="item-emoji">{it.emoji}</span>
                                )}
                            </div>
                            <h3 className="item-title">{it.name}</h3>
                            <p className="item-price">{it.price}</p>
                        </div>
                        <div className="item-actions">
                            <button className="btn btn-primary" onClick={() => addToCart(it.name)}>Add to Cart</button>
                            <button className="btn btn-dark" onClick={() => orderNow(it.name)}>Order Now</button>
                        </div>
                    </article>
                ))}
            </section>

            <div className={`toast ${toast.show ? "show" : ""}`}>
                <span>{toast.text || "Item added to cart!"}</span>
            </div>
        </div>
    );
}
