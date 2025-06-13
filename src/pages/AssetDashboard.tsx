
import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { AssetTable } from '../components/AssetTable';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';

export const AssetDashboard = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Asset Management</h1>
          <p className="text-[#1a1a1a] opacity-70">Assets > Asset List</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Asset"
            value="295"
            color="orange"
            icon={<Package className="w-8 h-8" />}
          />
          <StatsCard
            title="In Use"
            value="271"
            color="green"
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatsCard
            title="Breakdown"
            value="24"
            color="red"
            icon={<AlertTriangle className="w-8 h-8" />}
          />
        </div>
        
        {/* Asset Table */}
        <AssetTable />
      </main>
    </div>
  );
};
