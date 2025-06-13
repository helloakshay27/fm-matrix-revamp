
import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { StatsCard } from '../components/StatsCard';
import { AssetTable } from '../components/AssetTable';
import { AddAssetForm } from '../components/AddAssetForm';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';

export const AssetDashboard = () => {
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  const navItems = [
    { name: 'Project', active: false },
    { name: 'Maintenance', active: true },
    { name: 'CRM', active: false },
    { name: 'Utility', active: false },
    { name: 'Visitors', active: false },
    { name: 'Experience', active: false },
    { name: 'Property', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <Header />
      
      <main className="ml-64 pt-16 p-6">
        {/* Subheader Navigation */}
        <div className="mb-6 border-b border-[#D5DbDB]">
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  item.active
                    ? 'border-[#C72030] text-[#C72030]'
                    : 'border-transparent text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mb-6">
          <div>
            <p className="text-[#1a1a1a] opacity-70 mb-2">Assets &gt; Asset List</p>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">ASSET LIST</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Asset"
            value="2959"
            color="#8B5FBF"
            icon={<Package className="w-8 h-8" />}
          />
          <StatsCard
            title="In Use"
            value="2959"
            color="#10B981"
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <StatsCard
            title="Breakdown"
            value="0"
            color="#EF4444"
            icon={<AlertTriangle className="w-8 h-8" />}
          />
        </div>
        
        <AssetTable onAddAsset={() => setIsAddAssetOpen(true)} />
      </main>

      <AddAssetForm 
        isOpen={isAddAssetOpen} 
        onClose={() => setIsAddAssetOpen(false)} 
      />
    </div>
  );
};
