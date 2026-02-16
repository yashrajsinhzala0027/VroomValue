import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { loginUser, registerUser } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    // 1. Set user IMMEDIATELY from session data (No waiting for database)
                    const baseUser = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.first_name || session.user.user_metadata?.name || 'User',
                        role: 'user', // Default
                        token: session.access_token
                    };
                    setCurrentUser(baseUser);

                    // 2. Fetch extended profile in background
                    fetchProfile(session.user.id, session.access_token, session.user.email);
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                const baseUser = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.first_name || session.user.user_metadata?.name || 'User',
                    role: 'user',
                    token: session.access_token
                };
                setCurrentUser(baseUser);
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

            if (error || !profile || typeof profile !== 'object') {
                if (error) console.error("Supabase Profile Query Error:", error.message, error.code);
                else console.warn("Profile data is missing or invalid for UID:", uid);

                // Fallback to basic session data
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

            const mappedUser = {
                id: profile.id || uid,
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
