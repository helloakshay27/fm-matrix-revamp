
import React from 'react';
import { SurveyMappingTable } from '../components/SurveyMappingTable';

export const SurveyMappingDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Survey Mapping List</h2>
          <p className="text-muted-foreground">
            Survey &gt; Survey Mappings
          </p>
        </div>
      </div>
      
      {/* Survey Mapping Table */}
      <SurveyMappingTable />
    </div>
  );
};
