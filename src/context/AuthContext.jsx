/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("mansathi_user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const response = await authApi.me();
            if (response?.success) {
                setUser(response.user);
                localStorage.setItem("mansathi_user", JSON.stringify(response.user));
                if (response.token) {
                    localStorage.setItem("mansathi_token", response.token);
                }
            } else {
                setUser(null);
                localStorage.removeItem("mansathi_user");
                localStorage.removeItem("mansathi_token");
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        const response = await authApi.login(credentials);
        if (response?.success) {
            setUser(response.user);
            localStorage.setItem("mansathi_user", JSON.stringify(response.user));
            if (response.token) {
                localStorage.setItem("mansathi_token", response.token);
            }
        } else {
            setUser(null);
            localStorage.removeItem("mansathi_user");
            localStorage.removeItem("mansathi_token");
        }
        setLoading(false);
        return response;
    };

    const register = async (credentials) => {
        setLoading(true);
        const response = await authApi.register(credentials);
        if (response?.success) {
            setUser(response.user);
            localStorage.setItem("mansathi_user", JSON.stringify(response.user));
            if (response.token) {
                localStorage.setItem("mansathi_token", response.token);
            }
        } else {
            setUser(null);
            localStorage.removeItem("mansathi_user");
            localStorage.removeItem("mansathi_token");
        }
        setLoading(false);
        return response;
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        localStorage.removeItem("mansathi_user");
        localStorage.removeItem("mansathi_token");
    };

    const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
