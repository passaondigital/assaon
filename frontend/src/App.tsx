import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import DashboardPage from './pages/Dashboard';
import StudioPage from './pages/Studio';
import MissionControlPage from './pages/MissionControl';
import Phase4Integrations from './pages/Phase4Integrations';
import Phase5Billing from './pages/Phase5Billing';
import { isLoggedIn } from './lib/auth';

function RequireAuth({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/studio" element={<RequireAuth><StudioPage /></RequireAuth>} />
        <Route path="/mission-control" element={<MissionControlPage />} />
        <Route path="/integrations" element={<Phase4Integrations />} />
        <Route path="/billing" element={<Phase5Billing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
