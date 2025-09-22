import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getToken, saveToken, saveUser, saveBaseUrl } from '@/utils/auth';
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
    const checkAuthentication = () => {
      // First, check for token in URL parameters
      const urlParams = new URLSearchParams(location.search);
      const access_token = urlParams.get("access_token");
      const company_id = urlParams.get("company_id");
      const user_id = urlParams.get("user_id");

      console.log('ProtectedRoute Auth Check:', {
        access_token: access_token ? 'Present' : 'Missing',
        company_id,
        user_id,
        currentPath: location.pathname
      });

      // If token is in URL, store it first
      if (access_token) {
        console.log('ProtectedRoute: Storing token from URL parameters');
        
        // Save token using auth utility
        saveToken(access_token);
        
        // Save base URL for API calls
        const hostname = window.location.hostname;
        if (hostname.includes("vi-web.gophygital.work")) {
          saveBaseUrl("https://live-api.gophygital.work/");
        } else if (hostname.includes("localhost")) {
          saveBaseUrl("https://live-api.gophygital.work/");
        }
        
        // Store company and user data
        if (company_id) {
          localStorage.setItem("selectedCompanyId", String(company_id));
        }
        
        if (user_id) {
          localStorage.setItem("user_id", String(user_id));
          
          // Create a user object for VI token access
          const viUser = {
            id: parseInt(user_id),
            email: '',
            firstname: 'VI',
            lastname: 'User',
            access_token: access_token,
            user_type: 'vi_token_user'
          };
          saveUser(viUser);
          
          console.log('ProtectedRoute: VI User created and stored');
        }
        
        // Token is valid, user is authorized
        setIsAuthorized(true);
        return;
      }

      // Check if user is already authenticated
      const authenticated = isAuthenticated();
      const token = getToken();

      if (!authenticated || !token) {
        console.log('ProtectedRoute: No authentication found, redirecting to login');
        setIsAuthorized(false);
      } else {
        console.log('ProtectedRoute: User is authenticated');
        setIsAuthorized(true);
      }
    };

    checkAuthentication();
  }, [location.pathname, location.search]);

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