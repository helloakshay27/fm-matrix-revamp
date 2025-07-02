
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RuleFilterDialog } from '@/components/RuleFilterDialog';

export const RuleListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleNewRule = () => {
    navigate('/loyalty-rule-engine');
  };

  const handleFilterClick = () => {
    setFilterDialogOpen(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Rule Engine &gt; Rule List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rule List</h1>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={handleNewRule}
          className="bg-[#C72030] hover:bg-[#A01A28] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Rule
        </Button>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="border-gray-300"
            onClick={handleFilterClick}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button className="bg-[#C72030] hover:bg-[#A01A28] text-white px-6">
            Go!
          </Button>
          
          <Button variant="outline" className="border-gray-300">
            Reset
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-500 text-lg mb-2">
          No matching rules found. Adjust your filters to see results.
        </div>
      </div>

      {/* Filter Dialog */}
      <RuleFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
    </div>
  );
};
