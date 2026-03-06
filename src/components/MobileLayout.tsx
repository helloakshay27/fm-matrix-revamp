import React from "react";
import { useLocation } from "react-router-dom";

interface MobileLayoutProps {
  children: React.ReactNode;
}

// Routes that should have mobile PWA layout (no sidebar)
const PWA_ROUTES = [
  "/master/user/occupant-users",
  "/master/user/occupant-users/view",
];

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Check if current route is a PWA route
  const isPWARoute = PWA_ROUTES.some((route) =>
    location.pathname.includes(route)
  );

  if (!isPWARoute) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-pwa-layout min-h-screen bg-gray-50">
      <div className="w-full max-w-full">{children}</div>
    </div>
  );
};
