import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PatrollingDashboard } from './PatrollingDashboard';
import { PatrollingResponsePage } from './PatrollingResponsePage';

export const PatrollingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'list' | 'response'>('list');

  // Sync tab with URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'response') {
      setActiveTab('response');
    } else {
      setActiveTab('list');
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'list' | 'response') => {
    setActiveTab(tab);
    if (tab === 'response') {
      setSearchParams({ tab: 'response' });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      {activeTab === 'list' ? (
        <PatrollingDashboard />
      ) : (
        <PatrollingResponsePage />
      )}
    </div>
  );
};
