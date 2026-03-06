import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";

interface PWALayoutWrapperProps {
  children: ReactNode;
}

const PWA_ROUTES = [
  "/login-page",
  "/ops-console/settings/account/user-list-otp",
  "/ops-console/settings/account/user-list-otp/detail",
];

export const PWALayoutWrapper = ({ children }: PWALayoutWrapperProps) => {
  const location = useLocation();

  // Check if current route is a PWA route
  const isPWARoute = PWA_ROUTES.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(route + "/")
  );

  // For PWA routes, render without AdminLayout (no sidebar)
  if (isPWARoute) {
    return <>{children}</>;
  }

  // For non-PWA routes, use AdminLayout with sidebar
  return <AdminLayout>{children}</AdminLayout>;
};
