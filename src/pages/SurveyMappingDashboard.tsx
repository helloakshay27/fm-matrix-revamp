
import React from 'react';
import { SurveyMappingTable } from '../components/SurveyMappingTable';
import { Heading } from '@/components/ui/heading';

export const SurveyMappingDashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Heading level="h1" variant="default">Survey Mapping List</Heading>
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
