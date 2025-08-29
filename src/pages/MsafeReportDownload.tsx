
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const MsafeReportDownload = () => {
  const handleDownload = () => {
    // TODO: Wire up MSafe report generation/download API here
    console.log('MSafe report download clicked');
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          MSafe Report Download
        </h1>
        <p className="text-gray-600 mb-6">
          Generate and download the latest MSafe report for your records.
        </p>

        <Button
          onClick={handleDownload}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default MsafeReportDownload;