import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { useAuth } from "./context/auth/useAuth";
import AIVideoLandingPage from "./pages/AIVideoLandingPage";
import VerifyPayment from "./pages/VerifyPayment";

function App() {
    const { user } = useAuth();

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        const token = localStorage.getItem('fasma_token');
        const role = localStorage.getItem('fasma_role');
        const schoolAccountStatus = user?.schoolAccountStatus;

        // Allow access to login route even if suspended
        const location = useLocation();
        if (location.pathname === '/login') {
            return token ? <Navigate to={`/${role}/dashboard`} /> : children;
        }

        // Block access to all other routes if suspended
        if (schoolAccountStatus === 'suspended') {
            return <Navigate to="/suspended" />;
        }

        return token ? children : <Navigate to="/login" />;
    };

    const ProtectedSuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
        const token = localStorage.getItem('fasma_token');
        const role = localStorage.getItem('fasma_role');
        const schoolAccountStatus = user?.schoolAccountStatus;

        if (schoolAccountStatus === 'suspended') {
            return <Navigate to="/suspended" />;
        }

        return token && role === 'superAdmin' ? children : <Navigate to="/login" />;
    };

    const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
        const token = localStorage.getItem('fasma_token');
        const role = localStorage.getItem('fasma_role');
        const schoolAccountStatus = user?.schoolAccountStatus;

        if (schoolAccountStatus === 'suspended') {
            return <Navigate to="/suspended" />;
        }

        return token && role === 'admin' ? children : <Navigate to="/login" />;
    };

    const ProtectedTeacherRoute = ({ children }: { children: React.ReactNode }) => {
        const token = localStorage.getItem('fasma_token');
        const role = localStorage.getItem('fasma_role');
        const schoolAccountStatus = user?.schoolAccountStatus;

        if (schoolAccountStatus === 'suspended') {
            return <Navigate to="/suspended" />;
        }

        return token && role === 'teacher' ? children : <Navigate to="/login" />;
    };

    const ProtectedStudentRoute = ({ children }: { children: React.ReactNode }) => {
        const token = localStorage.getItem('fasma_token');
        const role = localStorage.getItem('fasma_role');
        const schoolAccountStatus = user?.schoolAccountStatus;

        if (schoolAccountStatus === 'suspended') {
            return <Navigate to="/suspended" />;
        }

        return token && role === 'student' ? children : <Navigate to="/login" />;
    };

    const ProtectedGuardianRoute = ({ children }: { children: React.ReactNode }) => {
        const token = localStorage.getItem('fasma_token');
        const role = localStorage.getItem('fasma_role');
        const schoolAccountStatus = user?.schoolAccountStatus;

        if (schoolAccountStatus === 'suspended') {
            return <Navigate to="/suspended" />;
        }

        return token && role === 'guardian' ? children : <Navigate to="/login" />;
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes that should be accessible even when suspended */}
                {/* <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} /> */}

                {/* Suspended account route */}
                {/* <Route path="/suspended" element={<SuspendedAccount />} /> */}

                {/* Protected routes */}
                {/* <Route path="/" element={
                    <ProtectedRoute>
                        <Navigate to={`/${user?.role}/dashboard`} />
                    </ProtectedRoute>
                } /> */}

                <Route path="/admin" element={
                    <ProtectedAdminRoute>
                        <AdminLayout />
                    </ProtectedAdminRoute>
                }>
                    {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
                </Route>
                {/* Other public routes */}
                {/* <Route path="/date" element={<DateRangePicker />} />
                <Route path="/payments/verify" element={<VerifyPayment />} />
                <Route path="/cbt/exam" element={<CBTApp />} /> */}

                <Route path="/" element={<AIVideoLandingPage />} />
                <Route path="/payments/verify" element={<VerifyPayment />} />

                {/* 404 route */}
                <Route
                    path="*"
                    element={
                        <div className="flex items-center justify-center min-h-screen bg-gray-50">
                            <div className="text-center px-6">
                                <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
                                <p className="mt-4 text-lg text-gray-600">
                                    Oops! The page you're looking for doesn't exist.
                                </p>
                                <Link
                                    to="/"
                                    className="mt-6 inline-block px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-2xl shadow-md transition"
                                    onClick={() => { sessionStorage.removeItem('activeNavItem'); }}
                                >
                                    Go Home
                                </Link>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;