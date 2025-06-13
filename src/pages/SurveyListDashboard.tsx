
import React, { useState } from 'react';
import { SurveyListTable } from '../components/SurveyListTable';
import { AddSurveyForm } from '../components/AddSurveyForm';

export const SurveyListDashboard = () => {
  const [isAddSurveyOpen, setIsAddSurveyOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Survey &gt; Survey List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SURVEY LIST</h1>
        </div>
      </div>
      
      {/* Survey List Table */}
      <SurveyListTable onAddSurvey={() => setIsAddSurveyOpen(true)} />

      {/* Add Survey Form Modal */}
      <AddSurveyForm 
        isOpen={isAddSurveyOpen} 
        onClose={() => setIsAddSurveyOpen(false)} 
      />
    </div>
  );
};
