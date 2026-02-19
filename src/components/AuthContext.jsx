import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { loginUser, registerUser } from '../api/mockApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false); // New: Track background profile fetch

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

            console.log("Auth Lifecycle Event:", event);

            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
                if (session) {
                    // DO NOT AWAIT handleLogin - allow app to mount immediately
                    handleLogin(session);
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
        }, 1000);

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
        // USE SESSION STORAGE HINT: Prevent 'user' role flicker on reload
        const cachedRole = sessionStorage.getItem('VV_ROLE_HINT') || 'user';
        const existingRole = (currentUser && currentUser.id === session.user.id) ? currentUser.role : cachedRole;

        const baseUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.first_name || session.user.user_metadata?.name || 'User',
            role: existingRole,
            token: session.access_token
        };
        // 3. Prepare for background verification
        const needsVerification = !processedUIDs.current.has(session.user.id);
        if (needsVerification) {
            setIsVerifying(true);
            processedUIDs.current.add(session.user.id);
        }

        setCurrentUser(baseUser);
        setLoading(false); // RELEASE MAIN LOCK

        // 4. Actually fetch verified role in background
        if (needsVerification) {
            fetchProfile(session.user.id, session.access_token, session.user.email, abortControllerRef.current.signal)
                .finally(() => setIsVerifying(false));
        }
    };

    const handleLogoutCleanup = React.useCallback(() => {
        if (!currentUser && processedUIDs.current.size === 0) return; // Already clean
        console.log("Nuclear State Cleanup Triggered");
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setCurrentUser(null);
        processedUIDs.current.clear();
        sessionStorage.removeItem('VV_ROLE_HINT'); // Clean cache on logout
    }, [currentUser]);

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
                const updatedUser = {
                    id: uid,
                    email: email || profile.email,
                    name: profile.name || 'User',
                    role: profile.role || 'user',
                    phone: profile.phone || '',
                    token
                };
                setCurrentUser(updatedUser);
                // PERSIST ROLE: Sync with session storage hint
                sessionStorage.setItem('VV_ROLE_HINT', updatedUser.role);
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
        loading,
        isVerifying // Expose this 
    }), [currentUser, login, signup, logout, loading, isVerifying]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
