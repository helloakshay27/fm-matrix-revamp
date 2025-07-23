
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { OTPVerificationPage } from '@/pages/OTPVerificationPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ForgotPasswordOTPPage } from '@/pages/ForgotPasswordOTPPage';
import { NewPasswordPage } from '@/pages/NewPasswordPage';
import { LoginSuccessPage } from '@/pages/LoginSuccessPage';
import { PasswordResetSuccessPage } from '@/pages/PasswordResetSuccessPage';
import { isAuthenticated } from '@/utils/auth';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Temporary Dashboard component
const Dashboard = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Welcome to your dashboard!</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />
              } 
            />
            <Route path="/otp-verification" element={<OTPVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/forgot-password-otp" element={<ForgotPasswordOTPPage />} />
            <Route path="/new-password" element={<NewPasswordPage />} />
            <Route path="/login-success" element={<LoginSuccessPage />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
