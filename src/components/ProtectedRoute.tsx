import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getToken } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  // useEffect(() => {
  //   // Check if token exists and is valid
  //   const authenticated = isAuthenticated();
  //   const token = getToken();

  //   if (!authenticated || !token) {
  //     toast({
  //       variant: "destructive",
  //       title: "Access Denied",
  //       description: "Please login to access this page",
  //       duration: 3000,
  //     });
  //     setIsAuthorized(false);
  //   } else {
  //     setIsAuthorized(true);
  //   }
  // }, [location.pathname, toast]);

  useEffect(() => {
    const authenticated = isAuthenticated();
    const token = getToken();

    if (!authenticated || !token) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [location.pathname]);

  // Show loading or spinner while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#C72030] border-r-[#C72030] border-b-gray-200 border-l-gray-200"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};