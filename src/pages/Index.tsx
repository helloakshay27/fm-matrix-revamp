
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    const isViSite = hostname.includes('vi-web.gophygital.work');

    if (isViSite) {
      navigate('/safety/m-safe/internal', { replace: true });
    } else {
      navigate('/maintenance/asset', { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
