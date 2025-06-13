
import React from 'react';
import { StatsCard } from '../components/StatsCard';
import { AssetTable } from '../components/AssetTable';
import { AddAssetForm } from '../components/AddAssetForm';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const Index = () => {
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  return (
    <div className="p-6">
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
      <AssetTable onAddAsset={() => setIsAddAssetOpen(true)} />

      {/* Add Asset Form Modal */}
      <AddAssetForm 
        isOpen={isAddAssetOpen} 
        onClose={() => setIsAddAssetOpen(false)} 
      />
    </div>
  );
};

export default Index;
