
import React, { useState } from 'react';
import { SurveyListTable } from '../components/SurveyListTable';
import { AddSurveyForm } from '../components/AddSurveyForm';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Filter, Download, RotateCcw, Search } from 'lucide-react';

export const SurveyListDashboard = () => {
  const [isAddSurveyOpen, setIsAddSurveyOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <p className="text-muted-foreground text-sm mb-2">
            Survey &gt; Survey List
          </p>
          <Heading level="h1" variant="default">Survey List</Heading>
        </div>
      </div>
      
      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsAddSurveyOpen(true)}
            className="flex items-center gap-2 bg-[#F2EEE9] text-[#BF213E] border-0 hover:bg-[#F2EEE9]/80"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BF213E] focus:border-transparent w-80"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 border-[#BF213E] text-[#BF213E]">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Survey List Table */}
      <SurveyListTable searchTerm={searchTerm} />

      {/* Add Survey Form Modal */}
      <AddSurveyForm 
        isOpen={isAddSurveyOpen} 
        onClose={() => setIsAddSurveyOpen(false)} 
      />
    </div>
  );
};
