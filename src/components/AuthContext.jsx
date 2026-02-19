import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { loginUser, registerUser } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const abortControllerRef = React.useRef(null);
    const processedUIDs = React.useRef(new Set());

    useEffect(() => {
        // 1. Initial State Check
        if (localStorage.getItem('VV_AUTH_LOCK') === 'true') {
            console.log("🔒 Persistent Auth Lock detected.");
            handleLogoutCleanup();
        }

        // 2. SINGLE SOURCE OF TRUTH: handles initial session AND updates
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth Lifecycle Event:", event);

            // CRITICAL: Block any session IF the lock is on AND we have a session
            if (localStorage.getItem('VV_AUTH_LOCK') === 'true') {
                if (session) {
                    console.log("🔒 Blocking session due to Auth Lock.");
                    handleLogoutCleanup();
                    supabase.auth.signOut({ scope: 'global' }).catch(() => { });
                } else if (currentUser) {
                    handleLogoutCleanup();
                }
                setLoading(false);
                return;
            }

            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
                if (session) {
                    await handleLogin(session);
                } else {
                    handleLogoutCleanup();
                }
            } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
                handleLogoutCleanup();
            }

            setLoading(false);
        });

        // Failsafe: force loading to false
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timer);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const handleLogin = async (session) => {
        // 1. Clear any pending profile fetches
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        // 2. Set basic state immediately from session
        // CRITICAL: Preserve existing role if we are just refreshing the same user
        // This prevents the "Access Denied" flicker when switching tabs
        const existingRole = (currentUser && currentUser.id === session.user.id) ? currentUser.role : 'user';

        const baseUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.first_name || session.user.user_metadata?.name || 'User',
            role: existingRole,
            token: session.access_token
        };
        setCurrentUser(baseUser);

        // 3. Fetch verified role (centralized deduplication)
        if (!processedUIDs.current.has(session.user.id)) {
            processedUIDs.current.add(session.user.id);
            await fetchProfile(session.user.id, session.access_token, session.user.email, abortControllerRef.current.signal);
        }
    };

    const handleLogoutCleanup = React.useCallback(() => {
        console.log("Nuclear State Cleanup Triggered");
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setCurrentUser(null);
        processedUIDs.current.clear();
    }, []);

    const fetchProfile = async (uid, token, email = null, signal) => {
        try {
            // STRICT: check if account is still relevant before requesting
            const { data: { session } } = await supabase.auth.getSession();

            // Check for lock here too
            if (!session || session.user.id !== uid || localStorage.getItem('VV_AUTH_LOCK') === 'true') return;

            let { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', uid)
                .maybeSingle();

            if (signal?.aborted) return;
            if (error) console.error("Profile Fetch Error:", error.message);

            if (!profile) {
                // UPSERT ONLY: No retry loops or recursion
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

                if (signal?.aborted) return;
                if (upsertError) {
                    console.error("Profile Sync Error:", upsertError.message);
                } else {
                    profile = newProfile;
                }
            }

            if (signal?.aborted) return;

            if (profile) {
                setCurrentUser({
                    id: uid,
                    email: email || profile.email,
                    name: profile.name || 'User',
                    role: profile.role || 'user',
                    phone: profile.phone || '',
                    token
                });
            }
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("AuthContext fetchProfile Critical:", err);
        }
    };

    const login = React.useCallback(async (email, password) => {
        // UNLOCK auth on manual login attempt
        localStorage.removeItem('VV_AUTH_LOCK');
        return await loginUser({ email, password });
    }, []);

    const signup = React.useCallback(async (userData) => {
        // UNLOCK auth on manual signup attempt
        localStorage.removeItem('VV_AUTH_LOCK');
        return await registerUser(userData);
    }, []);

    const logout = React.useCallback(async () => {
        try {
            console.log("Triggering global sign out...");
            // 1. Set Lock FIRST to prevent auto-restore during the process
            localStorage.setItem('VV_AUTH_LOCK', 'true');

            // 2. Clear local state synchronously
            handleLogoutCleanup();

            // 3. Force server-side cleanup (don't let it block indefinitely)
            await Promise.race([
                supabase.auth.signOut({ scope: 'global' }),
                new Promise(resolve => setTimeout(resolve, 3000))
            ]).catch(err => console.error("SignOut low-level error:", err));

            // 4. Final wipe
            Object.keys(localStorage).forEach(key => {
                if (key.includes('sb-') || key.includes('supabase.auth') || key.includes('supabase-')) {
                    localStorage.removeItem(key);
                }
            });
            localStorage.setItem('VV_AUTH_LOCK', 'true'); // Restore lock

            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

        } catch (err) {
            console.error("Logout process error:", err);
        } finally {
            handleLogoutCleanup();
        }
    }, [handleLogoutCleanup]);

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
