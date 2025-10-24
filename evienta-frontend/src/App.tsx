import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import VenueDetailsPage from './pages/VenueDetailsPage';
import TestCrudPage from './pages/TestCrudPage';
import FeatureTestPage from './pages/FeatureTestPage';
import ApiDocsPage from './pages/ApiDocsPage';
import ProfilePage from './components/common/ProfileSection';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/dashboard/customer" element={<UserDashboard />} />
          <Route path="/dashboard/vendor" element={<ProviderDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/venue/:id" element={<VenueDetailsPage />} />
          <Route path="/test-crud" element={<TestCrudPage />} />
          <Route path="/test-features" element={<FeatureTestPage />} />
          <Route path="/api-docs" element={<ApiDocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default App;