
import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectLayout } from '@/components/ProjectLayout';

export const FitoutViolationDashboard = () => {
  return (
    <ProjectLayout>
      <div className="space-y-6">
        <div className="text-sm text-gray-600">
          <span>Project</span>
          <span className="mx-2">></span>
          <span className="text-gray-900">Fitout Violation</span>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FITOUT VIOLATION</h1>
          <div className="flex gap-2">
            <Button className="bg-[#C72030] hover:bg-[#A01828] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500">Fitout violation content will be displayed here.</p>
        </div>
      </div>
    </ProjectLayout>
  );
};
