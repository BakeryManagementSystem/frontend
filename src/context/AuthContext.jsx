import { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        setAuthed(!!localStorage.getItem("access_token"));
    }, []);

    const login = () => setAuthed(true);
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_type");
        setAuthed(false);
    };

    return (
        <AuthCtx.Provider value={{ authed, login, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    return useContext(AuthCtx);
}
