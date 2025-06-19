
import React, { useState } from 'react';
import { SurveyListTable } from '../components/SurveyListTable';
import { AddSurveyForm } from '../components/AddSurveyForm';

export const SurveyListDashboard = () => {
  const [isAddSurveyOpen, setIsAddSurveyOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Survey List</h2>
          <p className="text-muted-foreground">
            Survey &gt; Survey List
          </p>
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
