
import React from 'react';
import { SurveyResponseTable } from '../components/SurveyResponseTable';

export const SurveyResponseDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Survey Response</h2>
          <p className="text-muted-foreground">
            Survey &gt; Survey Response
          </p>
        </div>
      </div>
      
      {/* Survey Response Table */}
      <SurveyResponseTable />
    </div>
  );
};
