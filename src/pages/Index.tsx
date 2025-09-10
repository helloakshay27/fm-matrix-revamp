
import React from 'react';
import { AssetDashboard } from './AssetDashboard';
import { MSafeDashboard } from './MSafeDashboard';

const Index = () => {
  const hostname = window.location.hostname;
  const isViSite = hostname.includes('vi-web.gophygital.work');

  return isViSite ? <MSafeDashboard /> : <AssetDashboard />;
};

export default Index;
