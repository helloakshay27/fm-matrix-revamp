import React from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AMCStatusCardProps {
  data: {
    totalAMCs: number;
    activeAMCs: number;
    inactiveAMCs: number;
    underServiceAMCs: number;
    expiredAMCs: number;
    upcomingExpiryAMCs: number;
  } | null;
  className?: string;
  onDownload?: () => Promise<void>;
}

export const AMCStatusCard: React.FC<AMCStatusCardProps> = ({ data, className, onDownload }) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC status data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading AMC status data:', error);
        toast({
          title: "Error", 
          description: "Failed to download AMC status data",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#C72030]">AMC Status Overview</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-[#C72030] hover:text-[#A01828]"
            onClick={handleDownload}
          />
        )}
      </div>
      
      {data ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{data.totalAMCs}</div>
            <div className="text-sm text-blue-700 font-medium">Total AMCs</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{data.activeAMCs}</div>
            <div className="text-sm text-green-700 font-medium">Active</div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{data.inactiveAMCs}</div>
            <div className="text-sm text-gray-700 font-medium">Inactive</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{data.underServiceAMCs}</div>
            <div className="text-sm text-orange-700 font-medium">Under Service</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{data.expiredAMCs}</div>
            <div className="text-sm text-red-700 font-medium">Expired</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{data.upcomingExpiryAMCs}</div>
            <div className="text-sm text-yellow-700 font-medium">Expiring Soon</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No AMC status data available for the selected date range
        </div>
      )}
    </div>
  );
};
