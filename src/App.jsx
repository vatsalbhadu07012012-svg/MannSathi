import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatButton from "./components/FloatingChatButton";
import CursorTrail from "./components/CursorTrail";

const Login = lazy(() => import("./Login"));
const SignIn = lazy(() => import("./SignIn"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Counsellors = lazy(() => import("./pages/Counsellors"));
const MoodTracking = lazy(() => import("./pages/MoodTracking"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ProgressDashboard = lazy(() => import("./pages/ProgressDashboard"));
const Support = lazy(() => import("./pages/Support"));
const Chatbot = lazy(() => import("./components/Chatbot"));
const MentalHealthCheckup = lazy(() => import("./components/MentalHealthCheckup"));
const HealthTracker = lazy(() => import("./pages/HealthTracker"));
const CounsellorChatPage = lazy(() => import("./pages/CounsellorChatPage"));
const CounsellorPortal = lazy(() => import("./pages/CounsellorPortal"));

const NotFound = () => (
    <div className="flex min-h-screen page-shell flex-col items-center justify-center px-6 text-center text-body transition-colors duration-200">
        <h1 className="text-4xl font-semibold text-heading">Page not found</h1>
        <p className="mt-3 max-w-md text-muted">The page you were looking for doesn’t exist or may have moved.</p>
        <a href="/home" className="mt-6 rounded-full bg-linear-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white">
            Go Home
        </a>
    </div>
);

const AppContent = () => {
    const location = useLocation();
    const hideFloatingChat = location.pathname === "/checkup" || location.pathname === "/assessment";

    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#070B1A] dark:text-white">Loading ManSathi...</div>}>
            <CursorTrail />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignIn />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <ProtectedRoute>
                            <About />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <ProtectedRoute>
                            <Contact />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chatbot />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkup"
                    element={
                        <ProtectedRoute>
                            <MentalHealthCheckup />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/assessment"
                    element={
                        <ProtectedRoute>
                            <MentalHealthCheckup />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <ProgressDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mood"
                    element={
                        <ProtectedRoute>
                            <MoodTracking />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/privacy"
                    element={
                        <ProtectedRoute>
                            <PrivacyPolicy />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute>
                            <ProgressDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/support"
                    element={
                        <ProtectedRoute>
                            <Support />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/counsellors"
                    element={
                        <ProtectedRoute>
                            <Counsellors />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/health-tracker"
                    element={
                        <ProtectedRoute>
                            <HealthTracker />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/counsellor-chat/:appointmentId"
                    element={
                        <ProtectedRoute>
                            <CounsellorChatPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/counsellor-portal" element={<CounsellorPortal />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {!hideFloatingChat && <FloatingChatButton />}
        </Suspense>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
