
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProjectsDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to fitout-setup as the default project page
    navigate('/projects/fitout-setup', { replace: true });
  }, [navigate]);

  return null;
};
