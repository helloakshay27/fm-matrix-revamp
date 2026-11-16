import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { CUSTOMER_USER_ROUTE, isCustomerUser } from "@/utils/auth";

/**
 * Locks customer users (login response `is_customer: true`) to the
 * customer page. While a customer session exists, every other route —
 * including public ones and back/forward navigation or typed URLs — is
 * replaced with a redirect to CUSTOMER_USER_ROUTE. The only way out is
 * logging out, which clears the session and lifts the lock.
 */
export const CustomerRouteGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // useLocation subscribes this guard to every navigation so it re-checks
  const location = useLocation();

  if (isCustomerUser() && location.pathname !== CUSTOMER_USER_ROUTE) {
    return <Navigate to={CUSTOMER_USER_ROUTE} replace />;
  }

  return <>{children}</>;
};

export default CustomerRouteGuard;
