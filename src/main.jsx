import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './components/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/Toasts';
import { CompareProvider } from './components/CompareContext';
import { WishlistProvider } from './components/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/admin_auth.css';
import VroomValueAI from './components/VroomValueAI';
import ValuationWizard from './components/ValuationWizard';
import { ListingSkeleton } from './components/SkeletonLoader';
import LoadingScreen from './components/LoadingScreen';

// VERCEL/VITE DEPLOYMENT FIX
window.addEventListener('vite:preloadError', (event) => {
    console.log('Preload error detected, forcing reload...', event);
    window.location.reload(true);
});

// Lazy Load Pages
const Home      = lazy(() => import('./pages/Home'));
const Listings  = lazy(() => import('./pages/Listings'));
const CarPage   = lazy(() => import('./pages/CarPage'));
const Sell      = lazy(() => import('./pages/Sell'));
const Saved     = lazy(() => import('./pages/Saved'));
const Admin     = lazy(() => import('./pages/Admin'));
const Login     = lazy(() => import('./pages/Login'));
const Signup    = lazy(() => import('./pages/Signup'));
const NotFound  = lazy(() => import('./pages/NotFound'));
const Contact   = lazy(() => import('./pages/Contact'));
const FAQ       = lazy(() => import('./pages/FAQ'));
const Terms     = lazy(() => import('./pages/Terms'));
const MyBids    = lazy(() => import('./pages/MyBids'));

import CompareTray from './components/CompareTray';

/* ── Page transition variants ── */
const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
    exit:    { opacity: 0, y: -6, transition: { duration: 0.22, ease: 'easeIn' } },
};

/* ── Animated page wrapper ── */
const AnimatedPage = ({ children }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
    >
        {children}
    </motion.div>
);

/* ── Suspense fallback ── */
const PageFallback = () => (
    <div className="container" style={{ padding: '80px 0' }}>
        <ListingSkeleton />
    </div>
);

/* ── Animated Routes wrapper (needs location) ── */
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Standalone Pages */}
                <Route path="/login"  element={<Suspense fallback={<PageFallback />}><AnimatedPage><Login /></AnimatedPage></Suspense>} />
                <Route path="/signup" element={<Suspense fallback={<PageFallback />}><AnimatedPage><Signup /></AnimatedPage></Suspense>} />

                {/* Main App Layout */}
                <Route path="/*" element={
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Header />
                        <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
                            <Suspense fallback={<PageFallback />}>
                                <Routes>
                                    <Route path="/"          element={<AnimatedPage><Home /></AnimatedPage>} />
                                    <Route path="/listings"  element={<AnimatedPage><Listings /></AnimatedPage>} />
                                    <Route path="/car/:id"   element={<AnimatedPage><CarPage /></AnimatedPage>} />
                                    <Route path="/sell"      element={<AnimatedPage><Sell /></AnimatedPage>} />
                                    <Route path="/saved"     element={<AnimatedPage><Saved /></AnimatedPage>} />
                                    <Route path="/admin"     element={<AnimatedPage><Admin /></AnimatedPage>} />
                                    <Route path="/my-bids"   element={<AnimatedPage><MyBids /></AnimatedPage>} />
                                    <Route path="/contact"   element={<AnimatedPage><Contact /></AnimatedPage>} />
                                    <Route path="/faq"       element={<AnimatedPage><FAQ /></AnimatedPage>} />
                                    <Route path="/terms"     element={<AnimatedPage><Terms /></AnimatedPage>} />
                                    <Route path="/valuation" element={<AnimatedPage><ValuationWizard /></AnimatedPage>} />
                                    <Route path="*"          element={<AnimatedPage><NotFound /></AnimatedPage>} />
                                </Routes>
                            </Suspense>
                        </main>
                        <Footer />
                        <VroomValueAI />
                        <CompareTray />
                    </div>
                } />
            </Routes>
        </AnimatePresence>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <ToastProvider>
                    <WishlistProvider>
                        <CompareProvider>
                            <LoadingScreen />
                            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                                <ScrollToTop />
                                <AnimatedRoutes />
                            </BrowserRouter>
                        </CompareProvider>
                    </WishlistProvider>
                </ToastProvider>
            </AuthProvider>
        </HelmetProvider>
    </React.StrictMode>
);
