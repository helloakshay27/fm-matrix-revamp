
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '../components/StatsCard';
import { InActiveAssetsTable } from '../components/InActiveAssetsTable';
import { Package, CheckCircle, AlertTriangle, Search } from 'lucide-react';

export const InActiveAssetsDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Assets &gt; Asset List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">IN-ACTIVE ASSET LIST</h1>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Asset"
          value="0"
          color="orange"
          icon={<Package className="w-8 h-8" />}
        />
        <StatsCard
          title="In Use"
          value="0"
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
      
      {/* In-Active Assets Table */}
      <InActiveAssetsTable />
    </div>
  );
};
