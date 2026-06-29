import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import SmoothScroll from './components/layout/SmoothScroll';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Landing from './components/sections/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardOverview from './pages/DashboardOverview';
import HealthScore from './pages/HealthScore';
import ContractReview from './pages/ContractReview';
import ComplianceCalendar from './pages/ComplianceCalendar';
import NoticeAgent from './pages/NoticeAgent';
import Clients from './pages/Clients';
import DocumentGenerator from './pages/DocumentGenerator';
import { useAuth, homePathFor } from './contexts/AuthContext';

/** Gate: requires login; optionally restricts by role. */
function ProtectedRoute({ roles }) {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading your workspace…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />;
  return <Outlet />;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function AuthLayout() {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  if (user) return <Navigate to={homePathFor(user.role)} replace />;
  return <Outlet />;
}

function DashboardLayout({ role }) {
  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: 'var(--text-primary)' }}>
      <span style={{ fontSize: '64px', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--gold-primary)' }}>404</span>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>Page not found.</p>
      <a href="/" style={{ color: 'var(--gold-primary)', fontWeight: 600, textDecoration: 'none' }}>Back to Home</a>
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* CA Dashboard */}
      <Route element={<ProtectedRoute roles={['CA']} />}>
        <Route path="/ca-dashboard" element={<DashboardLayout role="ca" />}>
          <Route index element={<DashboardOverview />} />
          <Route path="notices" element={<NoticeAgent />} />
          <Route path="clients" element={<Clients />} />
          <Route path="compliance" element={<ComplianceCalendar />} />
          <Route path="health-score" element={<HealthScore />} />
        </Route>
      </Route>

      {/* Law Firm Dashboard */}
      <Route element={<ProtectedRoute roles={['LAWYER']} />}>
        <Route path="/law-dashboard" element={<DashboardLayout role="lawyer" />}>
          <Route index element={<DashboardOverview />} />
          <Route path="contract-review" element={<ContractReview />} />
          <Route path="notices" element={<NoticeAgent />} />
          <Route path="clients" element={<Clients />} />
          <Route path="compliance" element={<ComplianceCalendar />} />
        </Route>
      </Route>

      {/* Individual Dashboard */}
      <Route element={<ProtectedRoute roles={['INDIVIDUAL']} />}>
        <Route path="/my-documents" element={<DashboardLayout role="individual" />}>
          <Route index element={<DocumentGenerator />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </BrowserRouter>
  );
}
