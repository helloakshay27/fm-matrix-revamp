
import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { AssetTable } from '../components/AssetTable';
import { AddAssetForm } from '../components/AddAssetForm';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';

export const AssetDashboard = () => {
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-6">
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">ASSET LIST</h1>
            <p className="text-gray-600">Assets &gt; Asset List</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Asset"
            value="2959"
            color="orange"
            icon={<Package className="w-8 h-8" />}
          />
          <StatsCard
            title="In Use"
            value="2959"
            color="green"
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatsCard
            title="Breakdown"
            value="0"
            color="red"
            icon={<AlertTriangle className="w-8 h-8" />}
          />
        </div>
        
        {/* Asset Table */}
        <AssetTable onAddAsset={() => setIsAddAssetOpen(true)} />
      </main>

      {/* Add Asset Form Modal */}
      <AddAssetForm 
        isOpen={isAddAssetOpen} 
        onClose={() => setIsAddAssetOpen(false)} 
      />
    </div>
  );
};
