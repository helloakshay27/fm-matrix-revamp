
import React from 'react';
import { SurveyMappingTable } from '../components/SurveyMappingTable';

export const SurveyMappingDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Survey &gt; Survey Mappings</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SURVEY MAPPING LIST</h1>
        </div>
      </div>
      
      {/* Survey Mapping Table */}
      <SurveyMappingTable />
    </div>
  );
};
