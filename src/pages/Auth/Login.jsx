import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(""); // success/error message
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
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

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.message || "Invalid credentials");
                setLoading(false);
                return;
            }

            // Expecting: { message: "...", user: { id, name, email, user_type, ... } }
            const userType = data?.user?.user_type?.toLowerCase();

            setMsg("User login successfully");

            // after successful login
            localStorage.setItem("token", data.token);   // <— save token
            localStorage.setItem("user", JSON.stringify(data.user));


            // Route based on user_type
            if (userType === "buyer") {
                navigate("/buyer");
            } else if (userType === "owner") {
                navigate("/owner");
            } else {
                // Fallback if user_type is missing or unexpected
                setMsg("Logged in, but user type is not recognized.");
            }
        } catch (err) {
            setMsg("Network error. Is the API running?");
        } finally {
            setLoading(false);
        }
    };

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
};

export default Login;
