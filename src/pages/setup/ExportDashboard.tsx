
import React, { useEffect } from 'react';
import { Download } from 'lucide-react';

export const ExportDashboard = () => {
  useEffect(() => {
    // Automatically trigger download when component mounts
    handleExport();
  }, []);

  const handleExport = () => {
    // Create sample Excel data in CSV format (which Excel can open)
    const csvContent = [
      'Employee ID,Employee Name,Schedule Date,Department,Building,Floor,Seat,Shift Time,Status',
      '73974,HO Occupant 2,29 December 2023,HR,Jyoti Tower,2nd Floor,HR 1,10:00 AM to 08:00 PM,Active',
      '71905,Prashant P,29 December 2023,Tech,Jyoti Tower,2nd Floor,S7,09:00 AM to 06:00 PM,Active',
      '71906,Sarah Johnson,30 December 2023,Finance,Jyoti Tower,3rd Floor,F3,10:30 AM to 06:30 PM,Active',
      '71907,Mike Wilson,30 December 2023,Operations,Jyoti Tower,1st Floor,O12,08:00 AM to 05:00 PM,Active',
      '71908,Emma Davis,31 December 2023,Tech,Jyoti Tower,2nd Floor,S15,09:00 AM to 06:00 PM,Active'
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `roster-export-${new Date().toISOString().split('T')[0]}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Excel file downloaded successfully');
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="mb-6">
          <p className="text-[#1a1a1a] opacity-70 mb-2">Space Management &gt; Setup &gt; Export</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">EXPORT</h1>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-[#1a1a1a]">Export Completed</h2>
            
            <p className="text-gray-600 max-w-md">
              Your roster data has been exported and downloaded automatically. 
              The file contains all employee roster information in Excel format.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-700">
                <strong>File name:</strong> roster-export-{new Date().toISOString().split('T')[0]}.csv
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Download time:</strong> {new Date().toLocaleString()}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Records exported:</strong> 5 employee records
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-[#C72030] text-white rounded hover:bg-[#C72030]/90 transition-colors"
              >
                Download Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
