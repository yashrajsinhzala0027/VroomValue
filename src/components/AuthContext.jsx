import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { loginUser, registerUser } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const processedUIDs = React.useRef(new Set());

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

                    // 2. Fetch extended profile in background (IF NOT ALREADY FETCHED)
                    if (!processedUIDs.current.has(session.user.id)) {
                        processedUIDs.current.add(session.user.id);
                        await fetchProfile(session.user.id, session.access_token, session.user.email);
                    }
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

                // Deduplicate sync calls
                if (!processedUIDs.current.has(session.user.id)) {
                    processedUIDs.current.add(session.user.id);
                    await fetchProfile(session.user.id, session.access_token, session.user.email);
                }
            } else {
                setCurrentUser(null);
                processedUIDs.current.clear(); // Clear cache on logout
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (uid, token, email = null) => {
        try {
            // 1. Fetch profile by ID ONLY
            // We NEVER query by email to avoid 406/409 errors and security issues
            let { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uid)
                .maybeSingle();

            if (error) console.error("Profile Fetch Error:", error.message);

            // 2. If doesn't exist, UPSERT via ID
            // Safe upsert that handles race conditions via ON CONFLICT DO NOTHING/UPDATE
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
                    // If upsert fails, we DO NOT retry. The database is the source of truth.
                } else {
                    profile = newProfile;
                }
            }

            // 3. Set User State
            // Even if profile fetch/create failed, we set a basic user object from session
            // to prevent the "White Page" crash.
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
            // Minimal fallback to prevent crash
            setCurrentUser(prevResult => ({
                id: uid,
                email: email || 'user@example.com',
                role: prevResult?.role || 'user',
                token
            }));
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
