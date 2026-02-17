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
            // 1. Fetch profile by ID
            let { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uid)
                .maybeSingle();

            if (error) console.error("Profile Fetch Error:", error.message);

            // 2. If doesn't exist, UPSERT via ID
            if (!profile) {
                console.log("Profile missing. Upserting for UID:", uid);

                const { data: newProfile, error: upsertError } = await supabase
                    .from('users')
                    .upsert({
                        id: uid,
                        email: email,
                        name: (await supabase.auth.getUser()).data.user?.user_metadata?.name || 'User',
                        role: 'user'
                    }, { onConflict: 'id' })
                    .select()
                    .maybeSingle();

                if (upsertError) {
                    console.error("Profile Sync Error:", upsertError.message);
                } else {
                    profile = newProfile;
                }
            }

            // 3. Set User State (No retries)
            const mappedUser = {
                id: uid,
                email: email || profile?.email,
                name: profile?.name || 'User',
                role: profile?.role || 'user',
                phone: profile?.phone || '',
                token
            };

            console.log("User Profile Loaded:", mappedUser.role);
            setCurrentUser(mappedUser);

        } catch (err) {
            console.error("AuthContext Critical Error:", err);
            // Minimal fallback to prevent crash
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
