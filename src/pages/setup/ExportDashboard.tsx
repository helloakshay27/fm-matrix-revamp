
import React, { useEffect } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Download } from 'lucide-react';

export const ExportDashboard = () => {
  useEffect(() => {
    // Automatically trigger download when component mounts
    handleExport();
  }, []);

  const handleExport = () => {
    // Create sample data for export
    const exportData = {
      timestamp: new Date().toISOString(),
      setup_data: {
        locations: [],
        users: [],
        assets: [],
        checklists: [],
        configurations: {}
      }
    };

    // Convert data to JSON string
    const dataStr = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `setup-export-${new Date().toISOString().split('T')[0]}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Export file downloaded successfully');
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EXPORT</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Export Completed</h2>
            
            <p className="text-gray-600 max-w-md">
              Your setup data has been exported and downloaded automatically. 
              The file contains all configuration data in JSON format.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>File name:</strong> setup-export-{new Date().toISOString().split('T')[0]}.json
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Download time:</strong> {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
