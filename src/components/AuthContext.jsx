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
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    await fetchProfile(session.user.id, session.access_token, session.user.email);
                }
            } catch (err) {
                console.error("Initial session check failed:", err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                // Don't await fetchProfile here to block the loading state
                fetchProfile(session.user.id, session.access_token, session.user.email);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (uid, token, email = null) => {
        try {
            console.log("Fetching profile for UID:", uid);
            const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uid)
                .maybeSingle();

            if (error) {
                console.error("Supabase Profile Query Error:", error.message, error.code);
                // If it's a 406 or profile not found, don't crash, use defaults
                const tempUser = {
                    id: uid,
                    email: email || 'user@example.com',
                    name: 'New User',
                    role: 'user',
                    token
                };
                setCurrentUser(tempUser);
                return;
            }

            if (!profile) {
                throw new Error("Profile query returned null data");
            }

            const mappedUser = {
                id: profile.id,
                email: profile.email || email,
                name: profile.name || 'User',
                role: profile.role || 'user',
                phone: profile.phone || '',
                token
            };
            setCurrentUser(mappedUser);
        } catch (err) {
            console.error("AuthContext Critical Error:", err);
            // Even on total failure, set a minimal user to prevent white screen if they have a session
            setCurrentUser({ id: uid, email: email || 'user@example.com', role: 'user', token });
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
