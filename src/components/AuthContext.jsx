
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

import { loginUser, registerUser } from '../api/mockApi';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('VroomValue_user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = React.useCallback(async (email, password) => {
        const user = await loginUser({ email, password });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        localStorage.setItem('VroomValue_user', JSON.stringify(user));
        setCurrentUser(user);
        return user;
    }, []);

    const signup = React.useCallback(async (userData) => {
        const user = await registerUser(userData);
        // We don't auto-login after signup, let user login manually
        return user;
    }, []);

    const logout = React.useCallback(() => {
        localStorage.removeItem('VroomValue_user');
        setCurrentUser(null);
    }, []);

    const value = React.useMemo(() => ({
        currentUser,
        login,
        signup,
        logout,
        loading
    }), [currentUser, login, signup, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
