import React, { useState } from "react";
import axios from "axios";
import "./LoginSignupPage.css";
import { FaGooglePlusG, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Helper: email check
const isEmail = (v) => /\S+@\S+\.\S+/.test(v);

// Minimal validators
const validateSignIn = ({ email, password }) => {
    const errors = {};
    if (!email?.trim()) errors.email = "Email is required";
    else if (!isEmail(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Min 6 characters";
    return errors;
};

const validateSignUp = ({ name, email, password, userType }) => {
    const errors = {};
    if (!name?.trim()) errors.name = "Full name is required";
    if (!email?.trim()) errors.email = "Email is required";
    else if (!isEmail(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Min 6 characters";
    if (!userType) errors.userType = "Please select your account type";
    return errors;
};

export default function LoginSignupPage() {
    const [active, setActive] = useState(false); // false = Sign In, true = Sign Up
    const navigate = useNavigate();
    const { login } = useAuth();

    // Sign In state
    const [si, setSi] = useState({ email: "", password: "" });
    const [siErr, setSiErr] = useState({});
    const [siLoading, setSiLoading] = useState(false);

    // Sign Up state
    const [su, setSu] = useState({
        name: "",
        email: "",
        password: "",
        userType: "",
    });
    const [suErr, setSuErr] = useState({});
    const [suLoading, setSuLoading] = useState(false);

    // Global alert
    const [alertMsg, setAlertMsg] = useState("");

    const API = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
        withCredentials: true,
    });

    const handleSignIn = async (e) => {
        e.preventDefault();
        setAlertMsg("");
        const errors = validateSignIn(si);
        setSiErr(errors);
        if (Object.keys(errors).length) return;

        setSiLoading(true);
        try {
            const { data } = await API.post("/auth/login", si);
            const token = data?.token;
            if (token) {
                localStorage.setItem("access_token", token);
                if (data?.userType) localStorage.setItem("user_type", data.userType);
                login(); // Update auth context
                setAlertMsg(`✅ Welcome back, ${data.userType === 'owner' ? 'Bakery Owner' : 'Valued Customer'}!`);
                navigate("/profile"); // Navigate to profile after successful login
            }
        } catch (err) {
            const msg = err?.response?.data?.error || "Login failed. Please check your credentials.";
            setAlertMsg(msg);
        } finally {
            setSiLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setAlertMsg("");
        const errors = validateSignUp(su);
        setSuErr(errors);
        if (Object.keys(errors).length) return;

        setSuLoading(true);
        try {
            const { data } = await API.post("/auth/register", su);
            const token = data?.token;
            if (token) {
                localStorage.setItem("access_token", token);
                if (su.userType) localStorage.setItem("user_type", su.userType);
                login(); // Update auth context
                setAlertMsg(`🎉 Welcome to Smart Bakery! Your ${su.userType === 'owner' ? 'Bakery Owner' : 'Customer'} account was created successfully.`);
                navigate("/profile"); // Navigate to profile after successful registration
            }
        } catch (err) {
            const msg = err?.response?.data?.error || "Sign up failed. Please try again.";
            setAlertMsg(msg);
        } finally {
            setSuLoading(false);
        }
    };

    return (
        <>
            <div className="auth-page-background"></div>
            <div className="page-root">
                <h1 className="main-heading">Smart Bakery Management System</h1>
                {alertMsg && (
                    <div className="toast" role="status" aria-live="polite">
                        {alertMsg}
                    </div>
                )}
                <div className={`container${active ? " active" : ""}`} id="container">
                    <div className="form-container sign-up">
                        <form onSubmit={handleSignUp} noValidate>
                            <h1>Create Account</h1>
                            <div className="social-icons">
                                <a href="#" className="icon" aria-label="Google">
                                    <FaGooglePlusG />
                                </a>
                                <a href="#" className="icon" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                            </div>
                            <div className="user-type-selector">
                                <span className="type-label">I am a:</span>
                                <div className="type-options">
                                    <label className={`type-option${su.userType === 'buyer' ? ' selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="userType"
                                            value="buyer"
                                            checked={su.userType === 'buyer'}
                                            onChange={(e) => setSu((p) => ({ ...p, userType: e.target.value }))}
                                        />
                                        <span className="option-text">🛒 Online Buyer</span>
                                    </label>
                                    <label className={`type-option${su.userType === 'owner' ? ' selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="userType"
                                            value="owner"
                                            checked={su.userType === 'owner'}
                                            onChange={(e) => setSu((p) => ({ ...p, userType: e.target.value }))}
                                        />
                                        <span className="option-text">👨‍🍳 Bakery Owner</span>
                                    </label>
                                </div>
                                {suErr.userType && (
                                    <div className="field-error user-type-error">
                                        {suErr.userType}
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Name"
                                autoComplete="name"
                                value={su.name}
                                onChange={(e) => setSu((p) => ({ ...p, name: e.target.value }))}
                                className={suErr.name ? "input-error" : ""}
                                aria-invalid={!!suErr.name}
                                aria-describedby={suErr.name ? "su-name-err" : undefined}
                            />
                            {suErr.name && (
                                <div id="su-name-err" className="field-error">
                                    {suErr.name}
                                </div>
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={su.email}
                                onChange={(e) => setSu((p) => ({ ...p, email: e.target.value }))}
                                className={suErr.email ? "input-error" : ""}
                                aria-invalid={!!suErr.email}
                                aria-describedby={suErr.email ? "su-email-err" : undefined}
                            />
                            {suErr.email && (
                                <div id="su-email-err" className="field-error">
                                    {suErr.email}
                                </div>
                            )}
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                value={su.password}
                                onChange={(e) => setSu((p) => ({ ...p, password: e.target.value }))}
                                className={suErr.password ? "input-error" : ""}
                                aria-invalid={!!suErr.password}
                                aria-describedby={suErr.password ? "su-pass-err" : undefined}
                            />
                            {suErr.password && (
                                <div id="su-pass-err" className="field-error">
                                    {suErr.password}
                                </div>
                            )}
                            <button type="submit" disabled={suLoading}>
                                {suLoading ? "Creating..." : `Sign Up as ${su.userType === 'owner' ? 'Bakery Owner' : su.userType === 'buyer' ? 'Online Buyer' : 'User'}`}
                            </button>
                        </form>
                    </div>
                    <div className="form-container sign-in">
                        <form onSubmit={handleSignIn} noValidate>
                            <h1>Sign In</h1>
                            <div className="social-icons">
                                <a href="#" className="icon" aria-label="Google">
                                    <FaGooglePlusG />
                                </a>
                                <a href="#" className="icon" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                autoComplete="email"
                                value={si.email}
                                onChange={(e) => setSi((p) => ({ ...p, email: e.target.value }))}
                                className={siErr.email ? "input-error" : ""}
                                aria-invalid={!!siErr.email}
                                aria-describedby={siErr.email ? "si-email-err" : undefined}
                            />
                            {siErr.email && (
                                <div id="si-email-err" className="field-error">
                                    {siErr.email}
                                </div>
                            )}
                            <input
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={si.password}
                                onChange={(e) => setSi((p) => ({ ...p, password: e.target.value }))}
                                className={siErr.password ? "input-error" : ""}
                                aria-invalid={!!siErr.password}
                                aria-describedby={siErr.password ? "si-pass-err" : undefined}
                            />
                            {siErr.password && (
                                <div id="si-pass-err" className="field-error">
                                    {siErr.password}
                                </div>
                            )}
                            <a href="#">Forget Your Password?</a>
                            <button type="submit" disabled={siLoading}>
                                {siLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>
                    <div className="toggle-container">
                        <div className="toggle">
                            <div className="toggle-panel toggle-left">
                                <h1>Welcome Back!</h1>
                                <p>Enter your personal details to use all of site features</p>
                                <button
                                    type="button"
                                    className="hidden"
                                    id="login"
                                    onClick={() => setActive(false)}
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="toggle-panel toggle-right">
                                <h1>Hello, Friend!</h1>
                                <p>Register with your personal details to use all of site features</p>
                                <button
                                    type="button"
                                    className="hidden"
                                    id="register"
                                    onClick={() => setActive(true)}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}