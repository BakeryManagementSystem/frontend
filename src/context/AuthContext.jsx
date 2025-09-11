// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useMemo } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // { name, user_type, email, ... }
    const [ready, setReady] = useState(false);

    // hydrate from localStorage on first load
    useEffect(() => {
        const t = localStorage.getItem("token") || localStorage.getItem("access_token");
        const name = localStorage.getItem("name") || localStorage.getItem("user_name");
        const email = localStorage.getItem("email");
        const user_type = localStorage.getItem("user_type");
        if (t) {
            setToken(t);
            setUser({ name, email, user_type });
        }
        setReady(true);
    }, []);

    const login = (payload) => {
        // payload = { token, user: { name, email, user_type } }
        if (payload?.token) {
            setToken(payload.token);
            localStorage.setItem("token", payload.token);
            localStorage.setItem("access_token", payload.token); // keep both to match previous code
        }
        if (payload?.user) {
            setUser(payload.user);
            if (payload.user.name)  localStorage.setItem("name", payload.user.name);
            if (payload.user.email) localStorage.setItem("email", payload.user.email);
            if (payload.user.user_type) localStorage.setItem("user_type", payload.user.user_type);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("user_type");
    };

    const value = useMemo(() => ({
        ready,
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout
    }), [ready, token, user]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
