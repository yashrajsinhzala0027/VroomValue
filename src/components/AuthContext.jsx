import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { loginUser, registerUser } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Initial Session Check
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await fetchProfile(session.user.id, session.access_token);
            }
            setLoading(false);
        };

        checkSession();

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                await fetchProfile(session.user.id, session.access_token);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (uid, token) => {
        try {
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uid)
                .single();

            if (error) {
                console.warn("Profile not found in users table, possibly a new signup.");
                return;
            }

            const mappedUser = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                role: profile.role,
                phone: profile.phone,
                token
            };
            setCurrentUser(mappedUser);
        } catch (err) {
            console.error("AuthContext Profile Fetch Error:", err);
            setCurrentUser(null);
        }
    };

    const login = React.useCallback(async (email, password) => {
        const user = await loginUser({ email, password });
        // Profile is handled by onAuthStateChange
        return user;
    }, []);

    const signup = React.useCallback(async (userData) => {
        return await registerUser(userData);
    }, []);

    const logout = React.useCallback(async () => {
        await supabase.auth.signOut();
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
