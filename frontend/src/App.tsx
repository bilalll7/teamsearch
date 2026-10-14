import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SkillsManagePage from './pages/SkillsManagePage';
import PortfolioManagePage from './pages/PortfolioManagePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import CreateOpportunityPage from './pages/CreateOpportunityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/opportunities" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/skills" element={<SkillsManagePage />} />
        <Route path="/profile/portfolio" element={<PortfolioManagePage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/create" element={<CreateOpportunityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
