
import React from 'react';
import { SurveyResponseTable } from '../components/SurveyResponseTable';

export const SurveyResponseDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Survey &gt; Survey Response</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SURVEY RESPONSE</h1>
        </div>
      </div>
      
      {/* Survey Response Table */}
      <SurveyResponseTable />
    </div>
  );
};
