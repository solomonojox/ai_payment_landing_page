
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
// import Landing from "./pages/Landing";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import Teachers from "./pages/Teachers";
import LoginPage from "./pages/Auth/Login";
import Guardians from "./pages/Guardians";
import Students from "./pages/Students";
import Administration from "./pages/Administration";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import Logs from "./pages/Logs";
import ChatInterface from "./pages/ChatInterface";
import TeacherLayout from "./layouts/TeacherLayout";
import GuardianLayout from "./layouts/GuardianLayout";
import { useAuth } from "./context/auth/useAuth";
import DateRangePicker from "./components/attendance/DateRangePicker";
import CreateNotificationPage from "./pages/Notification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import Records from "./pages/Records";
import Assignments from "./pages/Assignments";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import Admins from "./pages/Admins";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Events from "./pages/Events";
import Reports from "./pages/Reports";
import VerifyPayment from "./pages/VerifyPayment";
import Payment from "./pages/Payment";
import Attendance from "./pages/Attendance";
import CBTPage from "./pages/CBTPage";
import CBTApp from "./components/CBT/CBTApp";
import Library from "./pages/Library";
function App() {
  const { user } = useAuth();

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('fasma_token');
    return token ? children : <Navigate to="/login" />;
  };

  const ProtectedSuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('fasma_token');
    const role = localStorage.getItem('fasma_role');
    return token && role === 'superAdmin' ? children : <Navigate to="/login" />;
  };

  const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('fasma_token');
    const role = localStorage.getItem('fasma_role');
    return token && role === 'admin' ? children : <Navigate to="/login" />;
  };

  const ProtectedTeacherRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('fasma_token');
    const role = localStorage.getItem('fasma_role');
    return token && role === 'teacher' ? children : <Navigate to="/login" />;
  };

  const ProtectedStudentRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('fasma_token');
    const role = localStorage.getItem('fasma_role');
    return token && role === 'student' ? children : <Navigate to="/login" />;
  };

  const ProtectedGuardianRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('fasma_token');
    const role = localStorage.getItem('fasma_role');
    return token && role === 'guardian' ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      {user && user?.schoolAccountStatus === 'suspended' ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <main className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  Account Suspended
                </h1>
                <p className="text-sm text-gray-600 max-w-sm">
                  Your account has been temporarily suspended due to policy concerns or billing issues.
                </p>
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">What happens now?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>You can't access paid features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>Your data is safe and stored</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>We'll help restore access soon</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">What to do next</h3>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li>1. Check your email for details</li>
                    <li>2. Contact support if this is a mistake</li>
                    <li>3. Resolve any billing issues</li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <a
                    href="mailto:info@plidtech.com"
                    className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium text-center hover:bg-red-700 transition-colors"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/login"
                    className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium text-center hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  Need help?{" "}
                  <a href="tel:+2348102809730" className="text-gray-700 underline">
                    Call Support
                  </a>
                </p>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<ProtectedRoute><Navigate to={`/${user?.role}/dashboard`} /></ProtectedRoute>} />

          < Route path="/superAdmin" element={<ProtectedSuperAdminRoute> <SuperAdminLayout /></ProtectedSuperAdminRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="admins" element={<Admins />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="guardians" element={<Guardians />} />
            <Route path="records" element={<Records />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="cbt" element={<CBTPage />} />
            <Route path="library" element={<Library />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<Payment />} />
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chats" element={<ChatInterface />} />
            <Route path="announcements" element={<CreateNotificationPage />} />
            <Route path="logs" element={<Logs />} />
            <Route path="administration" element={<Administration />} />
            <Route path="profile" element={<UserProfilePage />} />
          </ Route>

          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="students" element={<Students />} />
            <Route path="guardians" element={<Guardians />} />
            <Route path="records" element={<Records />} />
            <Route path="payments" element={<Payment />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chats" element={<ChatInterface />} />
            <Route path="announcements" element={<CreateNotificationPage />} />
            <Route path="logs" element={<Logs />} />
            <Route path="administration" element={<Administration />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="cbt" element={<CBTPage />} />
            <Route path="library" element={<Library />} />
            {/* <Route path="cbt/exam" element={<CBTApp />} /> */}
          </Route>

          <Route path="/teacher" element={<ProtectedTeacherRoute><TeacherLayout /></ProtectedTeacherRoute>}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="records" element={<Records />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chats" element={<ChatInterface />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="cbt" element={<CBTPage />} />
            <Route path="library" element={<Library />} />
            {/* <Route path="cbt/exam" element={<CBTApp />} /> */}
          </Route>

          <Route path="/student" element={<ProtectedStudentRoute><StudentLayout /></ProtectedStudentRoute>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="records" element={<Records />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="payments" element={<Payment />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chats" element={<ChatInterface />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="cbt" element={<CBTPage />} />
            <Route path="library" element={<Library />} />
          </Route>
          <Route path="cbt/exam" element={<CBTApp />} />

          <Route path="/guardian" element={<ProtectedGuardianRoute><GuardianLayout /></ProtectedGuardianRoute>}>
            <Route path="my-students" element={<Students />} />
            <Route path="dashboard" element={<div>Guardian Dashboard</div>} />
            <Route path="records" element={<Records />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="payments" element={<Payment />} />
            <Route path="reports" element={<Reports />} />
            <Route path="chats" element={<ChatInterface />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/date" element={<DateRangePicker />} />
          <Route path="/payments/verify" element={<VerifyPayment />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center px-6">
                  <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
                  <p className="mt-4 text-lg text-gray-600">
                    Oops! The page you’re looking for doesn’t exist.
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
        </Routes >
      )}
    </BrowserRouter >
  );
}

export default App
