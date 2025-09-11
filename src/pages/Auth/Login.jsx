import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

import "./Login.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Login() {
    const navigate = useNavigate();
    const { login: setAuthSession } = useAuth(); // <-- call this on success

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // Try to parse JSON either way
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.message || "Invalid credentials");
                return;
            }

            // Defensive checks
            const token = data?.token;
            const user = data?.user || {};
            const role = String(user.user_type || "").trim().toLowerCase();

            if (!token) {
                setMsg("Login succeeded but token is missing from server response.");
                return;
            }

            // 1) Save to AuthContext (so ProtectedRoute & Navbar know you're logged in)
            setAuthSession({
                token,
                user: {
                    name: user.name,
                    email: user.email,
                    user_type: user.user_type,
                },
            });

            // 2) Also keep old localStorage keys for other parts of your app that read them
            localStorage.setItem("token", token);
            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("user_type", user.user_type || "buyer");
            localStorage.setItem("name", user.name || "");
            localStorage.setItem("email", user.email || "");

            setMsg("User login successfully");

            // Normalize role: treat "owner" or "seller" as owner area
            if (role === "owner" || role === "seller") {
                navigate("/owner", { replace: true });
            } else if (role === "buyer") {
                navigate("/buyer", { replace: true }); // or /shop if you prefer
            } else {
                // Unknown role → send to home (or buyer)
                navigate("/", { replace: true });
            }
        } catch (err) {
            setMsg("Network error. Is the API running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {msg && <p className="login-message">{msg}</p>}

                <p className="redirect-text">
                    Don’t have an account? <Link to="/signin">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
