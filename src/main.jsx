import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
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

// Styles loaded

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Listings = lazy(() => import('./pages/Listings'));
const CarPage = lazy(() => import('./pages/CarPage'));
const Sell = lazy(() => import('./pages/Sell'));
const Saved = lazy(() => import('./pages/Saved'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Terms = lazy(() => import('./pages/Terms'));
const MyBids = lazy(() => import('./pages/MyBids'));

import CompareTray from './components/CompareTray';

// Layout Wrapper
const Layout = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
            <Suspense fallback={<div className="container" style={{ padding: '40px' }}>Loading...</div>}>
                {children}
            </Suspense>
        </main>
        <Footer />
        <VroomValueAI />
        <CompareTray />
    </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <ToastProvider>
                <WishlistProvider>
                    <CompareProvider>
                        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                            <ScrollToTop />
                            <Routes>
                                {/* Standalone Pages (No Header/Footer) */}
                                <Route path="/login" element={
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <Login />
                                    </Suspense>
                                } />
                                <Route path="/signup" element={
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <Signup />
                                    </Suspense>
                                } />

                                {/* Main App Layout */}
                                <Route path="/*" element={
                                    <Layout>
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/listings" element={<Listings />} />
                                            <Route path="/car/:id" element={<CarPage />} />
                                            <Route path="/sell" element={<Sell />} />
                                            <Route path="/saved" element={<Saved />} />
                                            <Route path="/admin" element={<Admin />} />
                                            <Route path="/my-bids" element={<MyBids />} />
                                            <Route path="/contact" element={<Contact />} />
                                            <Route path="/faq" element={<FAQ />} />
                                            <Route path="/terms" element={<Terms />} />
                                            <Route path="/valuation" element={<ValuationWizard />} />
                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </Layout>
                                } />
                            </Routes>
                        </BrowserRouter>
                    </CompareProvider>
                </WishlistProvider>
            </ToastProvider>
        </AuthProvider>
    </React.StrictMode>,
);
