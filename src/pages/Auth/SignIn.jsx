import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
const API_BASE = "http://localhost:8000"; // or import.meta.env.VITE_API_URL

const SignIn = () => {
    const navigate = useNavigate();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [userType, setUserType] = React.useState("");
    const [msg, setMsg] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        const payload = { name, email, password, user_type: userType };

        try {
            const res = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setMsg(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            // ✅ Server inserted successfully
            setMsg("User registered successfully!");
            // Optional pop-up
            window.alert("User registered successfully!");

            // Clear form (optional)
            setName("");
            setEmail("");
            setPassword("");
            setUserType("");

            // ➡️ Route to Login page
            navigate("/auth", { replace: true }); // your Login page route
        } catch (err) {
            setMsg("Network error. Is the Laravel server running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="signin-container">
            <div className="signin-box">
                <h2>Create Account</h2>

                <form onSubmit={onSubmit}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select
                        name="user_type"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <option value="">Select User Type</option>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="owner">Owner</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {msg && <p className="redirect-text">{msg}</p>}

                <p className="redirect-text">
                    Already have an account? <Link to="/auth">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
