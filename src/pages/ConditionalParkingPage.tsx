import React from 'react';
import { getUser } from '@/utils/auth';
import ParkingDashboard from './ParkingDashboard';
import ParkingBookingListSiteWise from './ParkingBookingListSiteWise';

/**
 * Conditional Parking Component
 * Shows ParkingBookingListSiteWise for company_id 189, otherwise shows ParkingDashboard
 */
const ConditionalParkingPage: React.FC = () => {
  // Get current user from localStorage
  const currentUser = getUser();
  
  // Check if user exists and has lock_role with company_id
  const userCompanyId = currentUser?.lock_role?.company_id;
  
  // Show ParkingBookingListSiteWise for company_id 189 and 283, otherwise show ParkingDashboard
  if (userCompanyId === 189 || userCompanyId === 283) {
    return <ParkingBookingListSiteWise  />;
  }
  
  return <ParkingDashboard />;
};

export default ConditionalParkingPage;