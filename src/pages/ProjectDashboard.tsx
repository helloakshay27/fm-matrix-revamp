
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProjectDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Fitout Setup as the default view
    navigate('/projects/fitout-setup', { replace: true });
  }, [navigate]);

  return (
    <div className="p-6">
      <div className="text-center">
        <p>Redirecting to Fitout Setup...</p>
      </div>
    </div>
  );
};
