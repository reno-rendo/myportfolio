import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/index.css';
import { App } from './App';
import { Sidebar } from './components/Sidebar';
import { FloatingMenu } from './components/FloatingMenu';
import { Profile } from './components/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';

// Lazy load admin pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const LoginPage = lazy(() => import('./pages/admin/Login').then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.DashboardPage })));
const ProjectsPage = lazy(() => import('./pages/admin/Projects').then(module => ({ default: module.ProjectsPage })));
const ExperiencePage = lazy(() => import('./pages/admin/Experience').then(module => ({ default: module.ExperiencePage })));
const PublicationsPage = lazy(() => import('./pages/admin/Publications').then(module => ({ default: module.PublicationsPage })));
const CertificationsPage = lazy(() => import('./pages/admin/Certifications').then(module => ({ default: module.CertificationsPage })));
const SettingsPage = lazy(() => import('./pages/admin/Settings').then(module => ({ default: module.SettingsPage })));
const ServicesPage = lazy(() => import('./pages/admin/Services').then(module => ({ default: module.ServicesPage })));
const ToolsPage = lazy(() => import('./pages/admin/Tools').then(module => ({ default: module.ToolsPage })));
const StatsPage = lazy(() => import('./pages/admin/Stats').then(module => ({ default: module.StatsPage }))); // Added StatsPage

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// Portfolio Layout (public)
function PortfolioLayout() {
  return (
    <div className='min-h-screen lg:flex lg:justify-center lg:items-start lg:gap-10'>
      <Sidebar />
      <FloatingMenu />
      <Profile />
      <App />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Portfolio */}
          <Route path="/" element={<PortfolioLayout />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <Suspense fallback={<LoadingSpinner />}><LoginPage /></Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<LoadingSpinner />}><AdminLayout /></Suspense>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="publications" element={<PublicationsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="tools" element={<ToolsPage />} />
            <Route path="stats" element={<StatsPage />} /> {/* Added Stats Route */}
            <Route path="certifications" element={<CertificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
